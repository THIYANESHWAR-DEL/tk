/* ============================================================
   TK OFFICE MANAGER v5 – MAIN APP ENGINE
   ============================================================ */

/* -------------------------------
   STORAGE - BACKEND API INTEGRATION
--------------------------------*/
let DATA = {
    clients: [],
    works: [],
    fees: [],
    expenses: [],
    files: []
};

// API Base URL
const API_BASE = 'http://localhost:3000/api';

// Fetch all data from backend
async function loadData() {
    try {
        const response = await fetch(`${API_BASE}/data`);
        if (response.ok) {
            DATA = await response.json();
        } else {
            console.error('Failed to load data from backend');
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Save data to backend (for compatibility)
async function saveData() {
    // Data is automatically saved when making API calls
    // This function is kept for compatibility
}

/* -------------------------------
   LOGIN SYSTEM - BACKEND AUTHENTICATION
--------------------------------*/
async function checkLogin() {
    const token = sessionStorage.getItem("TK_LOGIN");
    if (token !== "YES") {
        window.location = "login.html";
    }
}

async function doLogin() {
    let username = document.getElementById("loginUser").value.trim();
    let password = document.getElementById("loginPass").value.trim();

    if (!username || !password) {
        document.getElementById("loginError").innerText = "Please enter username and password";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (result.success) {
            sessionStorage.setItem("TK_LOGIN", "YES");
            sessionStorage.setItem("TK_USER", JSON.stringify(result.user));
            window.location = "dashboard.html";
        } else {
            document.getElementById("loginError").innerText = result.error || "Login failed";
        }
    } catch (error) {
        console.error('Login error:', error);
        document.getElementById("loginError").innerText = "Connection error. Please try again.";
    }
}

function logout() {
    sessionStorage.removeItem("TK_LOGIN");
    sessionStorage.removeItem("TK_USER");
    window.location = "login.html";
}

function getCurrentUser() {
    const userStr = sessionStorage.getItem("TK_USER");
    return userStr ? JSON.parse(userStr) : null;
}

/* -------------------------------
   GENERIC HELPERS
--------------------------------*/
function uid() {
    return "ID" + Math.random().toString(36).substring(2, 10);
}

function todayStr() {
    return new Date().toISOString().split("T")[0];
}

function toDate(d) {
    return new Date(d);
}

/* -------------------------------
   GLOBAL SEARCH
--------------------------------*/
function globalSearch() {
    let q = document.getElementById("globalSearch").value.trim().toLowerCase();
    let box = document.getElementById("globalSearchResults");

    if (!q) {
        box.style.display = "none";
        box.innerHTML = "";
        return;
    }

    box.innerHTML = "";
    box.style.display = "block";

    function add(title, detail) {
        let d = document.createElement("div");
        d.innerHTML = `<b>${title}</b><br><span style='font-size:13px;color:#444;'>${detail}</span>`;
        box.appendChild(d);
    }

    // Search clients
    DATA.clients.forEach(c => {
        if (c.name.toLowerCase().includes(q))
            add("Client: " + c.name, c.phone || "");
    });

    // Search works
    DATA.works.forEach(w => {
        let s = (w.clientName + " " + w.service).toLowerCase();
        if (s.includes(q))
            add("Work: " + w.service, w.clientName + " – Due " + w.due);
    });

    // Search fees
    DATA.fees.forEach(f => {
        if (f.clientName.toLowerCase().includes(q))
            add("Fee: " + f.clientName, "₹" + f.amount);
    });

    // Search expenses
    DATA.expenses.forEach(e => {
        let s = (e.type + " " + e.note).toLowerCase();
        if (s.includes(q))
            add("Expense: " + e.type, "₹" + e.amount);
    });

    // Search files
    DATA.files.forEach(f => {
        let s = (f.fileNo + " " + f.clientName).toLowerCase();
        if (s.includes(q))
            add("File: " + f.fileNo, f.clientName + " – " + f.location);
    });
}
/* ============================================================
   CLIENTS MODULE
   ============================================================ */

async function loadClients() {
    try {
        const response = await fetch(`${API_BASE}/clients`);
        if (response.ok) {
            DATA.clients = await response.json();
        } else {
            console.error('Failed to load clients');
        }
    } catch (error) {
        console.error('Error loading clients:', error);
    }
    
    let list = document.getElementById("clientList");
    if (!list) return;
    
    list.innerHTML = "";

    DATA.clients.sort((a,b)=>a.name.localeCompare(b.name));

    DATA.clients.forEach(c => {
        list.innerHTML += `
        <tr>
            <td>${c.name}</td>
            <td>${c.phone || "-"}</td>
            <td>${c.gst || "-"}</td>
            <td>${c.monthly ? "Yes" : "No"}</td>
            <td>
                <button class="btn" onclick="deleteClient_v5('${c.id}')">Delete</button>
            </td>
        </tr>`;
    });
}

async function addClient_v5() {
    let name = document.getElementById("c_name").value.trim();
    let phone = document.getElementById("c_phone").value.trim();
    let email = document.getElementById("c_email").value.trim();
    let address = document.getElementById("c_address").value.trim();
    let gst = document.getElementById("c_gst").value.trim();
    let monthly = document.getElementById("c_monthly").checked;

    if (!name) return alert("Client name required");

    try {
        const response = await fetch(`${API_BASE}/clients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                phone,
                email,
                address,
                gst
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                await loadClients();
                
                document.getElementById("c_name").value = "";
                document.getElementById("c_phone").value = "";
                document.getElementById("c_email").value = "";
                document.getElementById("c_address").value = "";
                document.getElementById("c_gst").value = "";
                document.getElementById("c_monthly").checked = false;
            }
        } else {
            alert('Failed to add client');
        }
    } catch (error) {
        console.error('Error adding client:', error);
        alert('Error adding client');
    }
}

async function deleteClient_v5(id) {
    if (!confirm("Delete this client and all related data?")) return;

    try {
        const response = await fetch(`${API_BASE}/clients/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadClients();
        } else {
            alert('Failed to delete client');
        }
    } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error deleting client');
    }
}


/* ============================================================
   CLIENT SEARCH FOR WORK / FEE / FILE MODULES
   ============================================================ */

function workClientSearch(q) {
    let box = document.getElementById("workClientResults");
    if (!q) { box.style.display = "none"; box.innerHTML = ""; return; }

    box.innerHTML = "";

    DATA.clients
        .filter(c => c.name.toLowerCase().includes(q.toLowerCase()))
        .forEach(c => {
            let d = document.createElement("div");
            d.textContent = c.name;
            d.onclick = () => {
                document.getElementById("w_client").value = c.name;
                box.style.display = "none";
            };
            box.appendChild(d);
        });

    box.style.display = "block";
}


function feeClientSearch(q) {
    let box = document.getElementById("feeClientResults");
    if (!q) { box.style.display = "none"; box.innerHTML = ""; return; }

    box.innerHTML = "";

    DATA.clients
        .filter(c => c.name.toLowerCase().includes(q.toLowerCase()))
        .forEach(c => {
            let d = document.createElement("div");
            d.textContent = c.name;
            d.onclick = () => {
                document.getElementById("fee_client").value = c.name;
                document.getElementById("fee_client").dataset.id = c.id;
                box.style.display = "none";
            };
            box.appendChild(d);
        });

    box.style.display = "block";
}

function fileClientSearch(q) {
    let box = document.getElementById("fileClientResults");
    if (!q) { box.style.display = "none"; box.innerHTML = ""; return; }

    box.innerHTML = "";

    DATA.clients
        .filter(c => c.name.toLowerCase().includes(q.toLowerCase()))
        .forEach(c => {
            let d = document.createElement("div");
            d.textContent = c.name;
            d.onclick = () => {
                document.getElementById("file_client").value = c.name;
                document.getElementById("file_client").dataset.id = c.id;
                box.style.display = "none";
            };
            box.appendChild(d);
        });

    box.style.display = "block";
}


/* ============================================================
   WORKS MODULE (ADD, LIST, SORT, EDIT)
   ============================================================ */

async function loadWorks() {
    try {
        const response = await fetch(`${API_BASE}/works`);
        if (response.ok) {
            DATA.works = await response.json();
        } else {
            console.error('Failed to load works');
        }
    } catch (error) {
        console.error('Error loading works:', error);
    }
    
    renderPendingWorks();
    renderCompletedWorks();
}

/* ADD WORK */
async function addWork_v5() {
    let client = document.getElementById("w_client").value;
    let title = document.getElementById("w_title").value;
    let type = document.getElementById("w_service").value;
    let deadline = document.getElementById("w_deadline").value;
    let notes = document.getElementById("w_notes").value || '';

    if (!client) return alert("Select a client");
    if (!type) return alert("Select a service");
    if (!deadline) return alert("Select due date");

    try {
        const response = await fetch(`${API_BASE}/works`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                client,
                title,
                type,
                status: 'Pending',
                deadline,
                notes
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                await loadWorks();
                
                document.getElementById("w_client").value = "";
                document.getElementById("w_service").value = "";
                document.getElementById("w_title").value = "";
                document.getElementById("w_deadline").value = "";
                document.getElementById("w_notes").value = "";
            }
        } else {
            alert('Failed to add work');
        }
    } catch (error) {
        console.error('Error adding work:', error);
        alert('Error adding work');
    }
}


/* RENDER PENDING WORKS (sorted by date) */
function renderPendingWorks() {
    let box = document.getElementById("pendingWorks");
    if (!box) return;

    box.innerHTML = "";

    let pending = DATA.works.filter(w => w.status !== "Completed");

    pending.sort((a,b)=> new Date(a.deadline) - new Date(b.deadline));

    pending.forEach(w => {
        box.innerHTML += `
        <tr>
            <td>${w.client}</td>
            <td>${w.type}</td>
            <td>${w.deadline ? w.deadline.split('T')[0] : ''}</td>
            <td>${workStatusTag(w)}</td>
            <td>
                <button class="btn" onclick="markDone_v5('${w.id}')">Done</button>
                <button class="btn" onclick="editWork_v5('${w.id}')">Edit</button>
            </td>
        </tr>`;
    });
}


/* STATUS LABEL */
function workStatusTag(w) {
    let d = (new Date(w.deadline) - new Date()) / (1000*3600*24);

    if (d < 0) return `<span style='color:red;font-weight:bold;'>Overdue</span>`;
    if (Math.floor(d) === 0) return `<span style='color:#b8860b;font-weight:bold;'>Today</span>`;
    if (d <= 7) return `<span style='color:green;font-weight:bold;'>Next 7 Days</span>`;
    return `<span>Upcoming</span>`;
}


/* MARK DONE */
async function markDone_v5(id) {
    let w = DATA.works.find(x => x.id === id);
    if (!w) return;
    
    console.log('Found work to mark done:', w);

    let feeReceived = confirm("Fee Received? (OK = Yes, Cancel = No)");

    try {
        const updateData = {
            client: w.client || '',
            title: w.title || '',
            type: w.type || '',
            status: 'Completed',
            deadline: w.deadline || '',
            notes: w.notes || ''
        };
        
        console.log('Sending update data:', updateData);
        
        const response = await fetch(`${API_BASE}/works/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response:', result);
        
        if (response.ok) {
            await loadWorks();
        } else {
            alert('Failed to update work: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error updating work:', error);
        alert('Error updating work: ' + error.message);
    }
}


/* RENDER COMPLETED WORKS */
function renderCompletedWorks() {
    let box = document.getElementById("completedWorks");
    if (!box) return;

    box.innerHTML = "";

    let done = DATA.works.filter(w => w.status === "Completed");

    done.sort((a,b)=> new Date(b.updated_at) - new Date(a.updated_at));

    done.forEach(w => {
        box.innerHTML += `
        <tr>
            <td>${w.client}</td>
            <td>${w.type}</td>
            <td>${w.updated_at ? w.updated_at.split('T')[0] : ''}</td>
            <td>Completed</td>
        </tr>`;
    });
}


/* EDIT WORK */
async function editWork_v5(id) {
    let w = DATA.works.find(x => x.id === id);
    if (!w) return;

    let newType = prompt("Service:", w.type);
    if (!newType) return;

    let newDeadline = prompt("Due Date (YYYY-MM-DD):", w.deadline);
    if (!newDeadline) return;

    try {
        const response = await fetch(`${API_BASE}/works/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...w,
                type: newType,
                deadline: newDeadline
            })
        });
        
        if (response.ok) {
            await loadWorks();
        } else {
            alert('Failed to update work');
        }
    } catch (error) {
        console.error('Error updating work:', error);
        alert('Error updating work');
    }
}
/* ============================================================
   ACCOUNTS MODULE – FEES, EXPENSES, CASHBOOK
   ============================================================ */

/* LOAD ACCOUNTS */
async function loadAccounts() {
    try {
        const [feesResponse, expensesResponse] = await Promise.all([
            fetch(`${API_BASE}/fees`),
            fetch(`${API_BASE}/expenses`)
        ]);
        
        if (feesResponse.ok) {
            DATA.fees = await feesResponse.json();
        }
        
        if (expensesResponse.ok) {
            DATA.expenses = await expensesResponse.json();
        }
    } catch (error) {
        console.error('Error loading accounts:', error);
    }
    
    renderCashbook();
    renderMonthlySummary();
}

/* ADD FEE */
async function addFee_v5() {
    let client = document.getElementById("fee_client").value;
    let amount = document.getElementById("fee_amount").value;
    let worktype = document.getElementById("fee_worktype").value;
    let fee_date = document.getElementById("fee_date").value;
    let note = document.getElementById("fee_note").value;

    if (!client) return alert("Select client");
    if (!amount) return alert("Enter amount");
    if (!worktype) return alert("Select work type");
    if (!fee_date) return alert("Select date");

    try {
        const response = await fetch(`${API_BASE}/fees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                client,
                amount: Number(amount),
                worktype,
                fee_date,
                note
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                await loadAccounts();
                
                document.getElementById("fee_client").value = "";
                document.getElementById("fee_amount").value = "";
                document.getElementById("fee_worktype").value = "";
                document.getElementById("fee_date").value = "";
                document.getElementById("fee_note").value = "";
            }
        } else {
            alert('Failed to add fee');
        }
    } catch (error) {
        console.error('Error adding fee:', error);
        alert('Error adding fee');
    }
}

/* ADD EXPENSE */
async function addExpense_v5() {
    let category = document.getElementById("exp_type").value;
    let amount = document.getElementById("exp_amount").value;
    let expense_date = document.getElementById("exp_date").value;
    let note = document.getElementById("exp_note").value;

    if (!category) return alert("Select expense type");
    if (!amount) return alert("Enter amount");
    if (!expense_date) return alert("Select date");

    try {
        const response = await fetch(`${API_BASE}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category,
                amount: Number(amount),
                expense_date,
                note
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                await loadAccounts();
                
                document.getElementById("exp_type").value = "";
                document.getElementById("exp_amount").value = "";
                document.getElementById("exp_date").value = "";
                document.getElementById("exp_note").value = "";
            }
        } else {
            alert('Failed to add expense');
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        alert('Error adding expense');
    }
}


/* RENDER CASHBOOK */
function renderCashbook() {
    let box = document.getElementById("cashbookList");
    if (!box) return;

    box.innerHTML = "";

    let rows = [];

    DATA.fees.forEach(f => {
        rows.push({
            date: f.fee_date,
            type: "Receipt",
            part: f.client + " (" + f.worktype + ")",
            amount: "+" + f.amount
        });
    });

    DATA.expenses.forEach(e => {
        rows.push({
            date: e.expense_date,
            type: "Payment",
            part: e.category,
            amount: "-" + e.amount
        });
    });

    rows.sort((a,b)=> new Date(a.date) - new Date(b.date));

    rows.forEach(r => {
        box.innerHTML += `
        <tr>
            <td>${r.date}</td>
            <td>${r.type}</td>
            <td>${r.part}</td>
            <td>${r.amount}</td>
        </tr>`;
    });
}


/* MONTHLY SUMMARY */
function renderMonthlySummary() {
    let now = new Date();
    let ym = now.getFullYear() + "-" + String(now.getMonth()+1).padStart(2,'0');

    let feeTotal = 0;
    let expTotal = 0;

    DATA.fees.forEach(f => {
        if (f.fee_date && f.fee_date.startsWith(ym)) {
            feeTotal += Number(f.amount);
        }
    });

    DATA.expenses.forEach(e => {
        if (e.expense_date && e.expense_date.startsWith(ym)) {
            expTotal += Number(e.amount);
        }
    });

    let sumFee = document.getElementById("sum_fee");
    let sumExp = document.getElementById("sum_exp");
    let sumProfit = document.getElementById("sum_profit");
    
    if (sumFee) sumFee.innerText = "₹" + feeTotal;
    if (sumExp) sumExp.innerText = "₹" + expTotal;
    if (sumProfit) sumProfit.innerText = "₹" + (feeTotal - expTotal);
}


/* EXPORT CSV */
function exportAccountsCSV() {
    let rows = [["Date","Type","Particular","Amount"]];

    DATA.fees.forEach(f => {
        rows.push([f.date,"Receipt",f.clientName + " (" + f.type + ")",f.amount]);
    });

    DATA.expenses.forEach(e => {
        rows.push([e.date,"Payment",e.type,e.amount]);
    });

    let csv = rows.map(e => e.join(",")).join("\n");

    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "accounts_export.csv";
    a.click();
}



/* ============================================================
   FILE REGISTER MODULE
   ============================================================ */

async function loadFiles() {
    try {
        const response = await fetch(`${API_BASE}/files`);
        if (response.ok) {
            DATA.files = await response.json();
        } else {
            console.error('Failed to load files');
        }
    } catch (error) {
        console.error('Error loading files:', error);
    }
    
    renderFileList();

    let nextNo = "F-" + String(DATA.files.length + 1).padStart(3,'0');
    let fileNumberInput = document.getElementById("file_number");
    if (fileNumberInput) {
        fileNumberInput.value = nextNo;
    }
}

/* ADD FILE */
async function addFile_v5() {
    let client = document.getElementById("file_client").value;
    let service = document.getElementById("file_service").value;
    let location = document.getElementById("file_location").value;
    let status = document.getElementById("file_status").value;
    let note = document.getElementById("file_note").value;
    let file_number = document.getElementById("file_number").value;

    if (!client) return alert("Select client");
    if (!location) return alert("Enter location");
    if (!file_number) return alert("File number required");

    try {
        const response = await fetch(`${API_BASE}/files`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file_number,
                client,
                service,
                location,
                status,
                note
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                await loadFiles();
                
                document.getElementById("file_client").value = "";
                document.getElementById("file_service").value = "";
                document.getElementById("file_location").value = "";
                document.getElementById("file_status").value = "";
                document.getElementById("file_note").value = "";
            }
        } else {
            alert('Failed to add file');
        }
    } catch (error) {
        console.error('Error adding file:', error);
        alert('Error adding file');
    }
}

/* RENDER FILE LIST */
function renderFileList() {
    let box = document.getElementById("fileList");
    if (!box) return;

    box.innerHTML = "";

    DATA.files.forEach(f => {
        box.innerHTML += `
        <tr>
            <td>${f.file_number}</td>
            <td>${f.client}</td>
            <td>${f.service}</td>
            <td>${f.location}</td>
            <td>${f.status}</td>
            <td>${f.note || "-"}</td>
            <td>
                <button class="btn red-btn" onclick="deleteFile_v5('${f.id}')">Delete</button>
            </td>
        </tr>`;
    });
}

/* DELETE FILE */
async function deleteFile_v5(id) {
    if (!confirm("Delete this file record?")) return;

    try {
        const response = await fetch(`${API_BASE}/files/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadFiles();
        } else {
            alert('Failed to delete file');
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        alert('Error deleting file');
    }
}
/* ============================================================
   USER MANAGEMENT MODULE
   ============================================================ */

async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/users`);
        if (response.ok) {
            const users = await response.json();
            renderUserList(users);
            
            // Update system info
            document.getElementById("totalUsers").innerText = users.length;
            
            const currentUser = getCurrentUser();
            if (currentUser) {
                document.getElementById("currentUser").innerText = currentUser.username;
            }
        } else {
            console.error('Failed to load users');
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function renderUserList(users) {
    let list = document.getElementById("userList");
    if (!list) return;
    
    list.innerHTML = "";

    users.forEach(user => {
        const currentUser = getCurrentUser();
        const isCurrentUser = currentUser && currentUser.username === user.username;
        
        list.innerHTML += `
        <tr>
            <td><strong>${user.username}</strong> ${isCurrentUser ? '(You)' : ''}</td>
            <td><span style="background: #28a745; color: white; padding: 2px 8px; border-radius: 3px; font-size: 12px;">${user.role}</span></td>
            <td>${user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</td>
            <td>
                ${!isCurrentUser ? `<button class="btn red-btn" onclick="deleteAdminUser('${user.id}', '${user.username}')">Delete</button>` : '<span style="color: #999;">Current User</span>'}
            </td>
        </tr>`;
    });
}

async function addAdminUser() {
    let username = document.getElementById("newUsername").value.trim();
    let password = document.getElementById("newPassword").value.trim();

    if (!username || !password) {
        alert("Please enter both username and password");
        return;
    }

    if (password.length < 4) {
        alert("Password must be at least 4 characters long");
        return;
    }

    if (!confirm(`Create new admin user "${username}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`Admin user "${username}" created successfully!`);
            document.getElementById("newUsername").value = "";
            document.getElementById("newPassword").value = "";
            await loadUsers();
        } else {
            alert('Failed to create user: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error creating user:', error);
        alert('Error creating user: ' + error.message);
    }
}

async function deleteAdminUser(userId, username) {
    if (!confirm(`Delete admin user "${username}"? This action cannot be undone.`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`Admin user "${username}" deleted successfully!`);
            await loadUsers();
        } else {
            alert('Failed to delete user: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user: ' + error.message);
    }
}

/* ============================================================
   DASHBOARD MODULE
   ============================================================ */

async function loadDashboard() {
    try {
        // Load dashboard statistics from backend
        const statsResponse = await fetch(`${API_BASE}/stats`);
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            
            // Update basic statistics
            document.getElementById("d_pending").innerText = stats.activeWorks || 0;
            document.getElementById("totalClients").innerText = stats.totalClients || 0;
            document.getElementById("totalFiles").innerText = stats.totalFiles || 0;
        }
        
        // Load detailed data for date-based calculations
        await loadData();
        
        // Today due
        let today = todayStr();
        let todayDue = DATA.works.filter(w => {
            const status = w.status || "Pending";
            return status !== "Completed" && w.deadline === today;
        }).length;
        document.getElementById("d_today").innerText = todayDue;

        // Next 7 days
        let next7 = DATA.works.filter(w => {
            const status = w.status || "Pending";
            if (status === "Completed") return false;
            let diff = (new Date(w.deadline) - new Date()) / (1000*3600*24);
            return diff > 0 && diff <= 7;
        }).length;
        document.getElementById("d_week").innerText = next7;

        // Overdue
        let overdue = DATA.works.filter(w => {
            const status = w.status || "Pending";
            return status !== "Completed" && new Date(w.deadline) < new Date(today);
        }).length;
        document.getElementById("d_overdue").innerText = overdue;

        /* FEES SUMMARY */
        let feeToday = 0, feeWeek = 0, feeMonth = 0;
        let now = new Date();
        let weekDate = new Date(); 
        weekDate.setDate(now.getDate() - 7);
        let ym = now.getFullYear() + "-" + String(now.getMonth()+1).padStart(2,'0');

        console.log('Processing fees:', DATA.fees.length, 'fees found');
        console.log('Today date:', today);
        console.log('Week date:', weekDate);
        console.log('Month year:', ym);

        DATA.fees.forEach(f => {
            let fd = new Date(f.fee_date);
            console.log('Processing fee:', f);

            if (f.fee_date === today) {
                feeToday += Number(f.amount);
                console.log('Added to today fee:', f.amount);
            }
            if (fd >= weekDate) {
                feeWeek += Number(f.amount);
                console.log('Added to week fee:', f.amount);
            }
            if (f.fee_date && f.fee_date.startsWith(ym)) {
                feeMonth += Number(f.amount);
                console.log('Added to month fee:', f.amount);
            }
        });

        console.log('Fee totals - Today:', feeToday, 'Week:', feeWeek, 'Month:', feeMonth);

        const feeTodayEl = document.getElementById("fee_today");
        const feeWeekEl = document.getElementById("fee_week");
        const feeMonthEl = document.getElementById("fee_month");
        
        if (feeTodayEl) feeTodayEl.innerText = "₹" + feeToday;
        if (feeWeekEl) feeWeekEl.innerText = "₹" + feeWeek;
        if (feeMonthEl) feeMonthEl.innerText = "₹" + feeMonth;

        /* EXPENSES SUMMARY */
        let expToday = 0, expWeek = 0, expMonth = 0;

        console.log('Processing expenses:', DATA.expenses.length, 'expenses found');

        DATA.expenses.forEach(e => {
            let ed = new Date(e.expense_date);
            console.log('Processing expense:', e);

            if (e.expense_date === today) {
                expToday += Number(e.amount);
                console.log('Added to today expense:', e.amount);
            }
            if (ed >= weekDate) {
                expWeek += Number(e.amount);
                console.log('Added to week expense:', e.amount);
            }
            if (e.expense_date && e.expense_date.startsWith(ym)) {
                expMonth += Number(e.amount);
                console.log('Added to month expense:', e.amount);
            }
        });

        console.log('Expense totals - Today:', expToday, 'Week:', expWeek, 'Month:', expMonth);

        const expTodayEl = document.getElementById("exp_today");
        const expWeekEl = document.getElementById("exp_week");
        const expMonthEl = document.getElementById("exp_month");
        
        if (expTodayEl) expTodayEl.innerText = "₹" + expToday;
        if (expWeekEl) expWeekEl.innerText = "₹" + expWeek;
        if (expMonthEl) expMonthEl.innerText = "₹" + expMonth;
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}



/* ============================================================
   AUTO GST WORK GENERATOR (GSTR-1 & GSTR-3B)
   ============================================================ */

function autoGST_generate() {
    let mon = document.getElementById("gst_month").value;
    if (!mon) return alert("Select month");

    let [year, month] = mon.split("-");
    month = Number(month);

    let monthName = new Date(mon + "-01").toLocaleString("en", { month: "long" });

    DATA.clients.filter(c => c.monthly).forEach(c => {

        // GSTR 1
        DATA.works.push({
            id: uid(),
            clientId: c.id,
            clientName: c.name,
            title: "",
            service: "GSTR-1 Filing (" + monthName + ")",
            due: `${year}-${String(month).padStart(2,'0')}-11`,
            status: "pending",
            feeStatus: "not received",
            completedDate: ""
        });

        // GSTR 3B
        DATA.works.push({
            id: uid(),
            clientId: c.id,
            clientName: c.name,
            title: "",
            service: "GSTR-3B Filing (" + monthName + ")",
            due: `${year}-${String(month).padStart(2,'0')}-20`,
            status: "pending",
            feeStatus: "not received",
            completedDate: ""
        });
    });

    saveData();
    alert("GST Works Generated Successfully");
    renderPendingWorks();
}



/* ============================================================
   BACKUP & RESTORE
   ============================================================ */

function downloadBackup_v5() {
    let blob = new Blob([JSON.stringify(DATA, null, 2)], {type: "application/json"});
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "TK_Office_Manager_v5_Backup.json";
    a.click();
}

function restoreBackup_v5() {
    let file = document.getElementById("restore_file").files[0];
    if (!file) return alert("Select a backup file");

    let reader = new FileReader();
    reader.onload = function(e) {
        try {
            DATA = JSON.parse(e.target.result);
            saveData();
            alert("Backup restored successfully!");
            location.reload();
        } catch {
            alert("Invalid backup file");
        }
    };
    reader.readAsText(file);
}
