// Cloud Infrastructure Dashboard JavaScript

// File storage
let uploadedFiles = [];
let projectStructure = {};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeDragAndDrop();
    initializeAnimations();
    updateStats();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Scroll to section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Drag and drop functionality
function initializeDragAndDrop() {
    const dropZone = document.getElementById('dropZone');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('dragover');
    }

    function unhighlight(e) {
        dropZone.classList.remove('dragover');
    }

    dropZone.addEventListener('drop', handleDrop, false);
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(event) {
    const files = event.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    const fileList = document.getElementById('fileList');
    
    ([...files]).forEach(file => {
        // Check if it's a ZIP file
        if (file.name.endsWith('.zip')) {
            extractZip(file);
        } else {
            // Add regular file
            uploadedFiles.push(file);
            displayFile(file);
        }
    });

    updateFileCount();
}

function displayFile(file) {
    const fileList = document.getElementById('fileList');
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const fileSize = formatFileSize(file.size);
    const fileIcon = getFileIcon(file.name);
    
    fileItem.innerHTML = `
        <div class="file-info">
            <span class="file-icon">${fileIcon}</span>
            <div>
                <div class="file-name">${file.name}</div>
                <div class="file-size">${fileSize}</div>
            </div>
        </div>
        <div class="file-actions">
            <button class="btn btn-primary" onclick="previewFile('${file.name}')" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                👁️ View
            </button>
            <button class="btn btn-danger" onclick="removeFile('${file.name}')" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                🗑️
            </button>
        </div>
    `;
    
    fileList.appendChild(fileItem);
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        'html': '🌐',
        'css': '🎨',
        'js': '⚡',
        'json': '📋',
        'pdf': '📄',
        'doc': '📝',
        'docx': '📝',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'gif': '🖼️',
        'svg': '🖼️',
        'zip': '📦',
        'rar': '📦',
        'mp4': '🎬',
        'mp3': '🎵',
        'txt': '📃'
    };
    return icons[ext] || '📄';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFile(filename) {
    uploadedFiles = uploadedFiles.filter(f => f.name !== filename);
    renderFileList();
    updateFileCount();
}

function renderFileList() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    uploadedFiles.forEach(file => displayFile(file));
}

function updateFileCount() {
    const count = uploadedFiles.length;
    const uploadSection = document.querySelector('.upload-section');
    const countDisplay = uploadSection.querySelector('.file-count') || document.createElement('div');
    countDisplay.className = 'file-count';
    countDisplay.style.cssText = 'margin-top: 1rem; color: var(--accent-color); font-weight: bold;';
    countDisplay.textContent = `${count} file(s) uploaded`;
    
    if (!uploadSection.querySelector('.file-count')) {
        uploadSection.appendChild(countDisplay);
    } else {
        uploadSection.querySelector('.file-count').textContent = `${count} file(s) uploaded`;
    }
}

// ZIP extraction simulation
function extractZip(zipFile) {
    // Simulate ZIP extraction
    const fileList = document.getElementById('fileList');
    const extractingItem = document.createElement('div');
    extractingItem.className = 'file-item';
    extractingItem.innerHTML = `
        <div class="file-info">
            <span class="file-icon">📦</span>
            <div>
                <div class="file-name">${zipFile.name}</div>
                <div class="file-size">Extracting...</div>
            </div>
        </div>
    `;
    fileList.appendChild(extractingItem);

    // Simulate extraction delay
    setTimeout(() => {
        // Remove extracting item
        extractingItem.remove();
        
        // Add simulated extracted files
        const extractedFiles = [
            { name: 'index.html', size: 4567 },
            { name: 'styles.css', size: 2345 },
            { name: 'script.js', size: 3456 },
            { name: 'assets/logo.png', size: 12345 },
            { name: 'README.md', size: 890 }
        ];

        extractedFiles.forEach(file => {
            const fileObj = new File([''], file.name, { size: file.size });
            uploadedFiles.push(fileObj);
            displayFile(fileObj);
        });

        updateFileCount();
        showNotification('ZIP file extracted successfully!');
    }, 2000);
}

// File preview
function previewFile(filename) {
    const file = uploadedFiles.find(f => f.name === filename);
    if (!file) return;

    const modal = document.getElementById('previewModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = `Preview: ${filename}`;
    
    const ext = filename.split('.').pop().toLowerCase();
    
    if (['html', 'css', 'js', 'json', 'txt', 'md'].includes(ext)) {
        // For text files, show content preview
        const reader = new FileReader();
        reader.onload = function(e) {
            modalBody.innerHTML = `
                <pre style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; overflow-x: auto; max-height: 400px; color: var(--text-primary);">${escapeHtml(e.target.result.substring(0, 2000))}${e.target.result.length > 2000 ? '...' : ''}</pre>
            `;
        };
        reader.readAsText(file);
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) {
        // For images, show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            modalBody.innerHTML = `
                <img src="${e.target.result}" alt="${filename}" style="max-width: 100%; max-height: 400px; border-radius: 8px;">
            `;
        };
        reader.readAsDataURL(file);
    } else {
        modalBody.innerHTML = `
            <p style="color: var(--text-secondary);">Preview not available for this file type.</p>
            <p style="margin-top: 1rem;"><strong>File Name:</strong> ${file.name}</p>
            <p><strong>File Size:</strong> ${formatFileSize(file.size)}</p>
            <p><strong>File Type:</strong> ${file.type || 'Unknown'}</p>
        `;
    }

    modal.classList.add('active');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function closeModal() {
    const modal = document.getElementById('previewModal');
    modal.classList.remove('active');
}

// Close modal on outside click
document.getElementById('previewModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Deploy project
function deployProject() {
    if (uploadedFiles.length === 0) {
        showNotification('Please upload files first!', 'error');
        return;
    }

    // Check for index.html
    const hasIndexHtml = uploadedFiles.some(f => f.name.toLowerCase() === 'index.html');
    
    if (hasIndexHtml) {
        showNotification('🚀 Deploying project with index.html...', 'success');
        
        // Simulate deployment
        setTimeout(() => {
            showNotification('✅ Project deployed successfully!', 'success');
            showDeploymentUrl();
        }, 2000);
    } else {
        showNotification('⚠️ No index.html found. Deploying as static files...', 'warning');
        
        setTimeout(() => {
            showNotification('✅ Files deployed successfully!', 'success');
            showDeploymentUrl();
        }, 2000);
    }
}

function showDeploymentUrl() {
    const fileList = document.getElementById('fileList');
    const urlItem = document.createElement('div');
    urlItem.className = 'file-item';
    urlItem.style.background = 'rgba(16, 185, 129, 0.1)';
    urlItem.style.border = '1px solid var(--success-color)';
    urlItem.innerHTML = `
        <div class="file-info">
            <span class="file-icon">🌐</span>
            <div>
                <div class="file-name" style="color: var(--success-color);">Deployment URL</div>
                <div class="file-size">https://cloud.adegan-global.com/project-${Date.now()}</div>
            </div>
        </div>
        <div class="file-actions">
            <button class="btn btn-success" onclick="window.open('https://cloud.adegan-global.com', '_blank')" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                🔗 Open
            </button>
        </div>
    `;
    fileList.appendChild(urlItem);
}

// Clear all files
function clearFiles() {
    if (uploadedFiles.length === 0) {
        showNotification('No files to clear.', 'warning');
        return;
    }

    if (confirm('Are you sure you want to clear all uploaded files?')) {
        uploadedFiles = [];
        renderFileList();
        updateFileCount();
        showNotification('All files cleared.', 'success');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    const colors = {
        success: 'background: var(--success-color);',
        error: 'background: var(--danger-color);',
        warning: 'background: var(--warning-color);',
        info: 'background: var(--primary-color);'
    };

    notification.style.cssText += colors[type] || colors.info;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize animations
function initializeAnimations() {
    // Animate stats on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-value').forEach(stat => {
        observer.observe(stat);
    });
}

function animateValue(element) {
    const finalValue = element.textContent;
    const isPercentage = finalValue.includes('%');
    const isTB = finalValue.includes('TB');
    const isK = finalValue.includes('K');
    
    let numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
    let currentValue = 0;
    const duration = 2000;
    const increment = numericValue / (duration / 16);

    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        
        let displayValue = currentValue.toFixed(1);
        if (isPercentage) displayValue += '%';
        else if (isTB) displayValue += 'TB';
        else if (isK) displayValue += 'K';
        else displayValue = Math.round(displayValue);
        
        element.textContent = displayValue;
    }, 16);
}

// Update stats dynamically
function updateStats() {
    // Simulate real-time updates
    setInterval(() => {
        const cpuUsage = Math.floor(Math.random() * 30) + 60;
        const memoryUsage = Math.floor(Math.random() * 20) + 55;
        const storageUsage = Math.floor(Math.random() * 10) + 75;

        updateProgressBar('CPU Usage', cpuUsage);
        updateProgressBar('Memory Usage', memoryUsage);
        updateProgressBar('Storage Usage', storageUsage);
    }, 5000);
}

function updateProgressBar(label, value) {
    const progressBars = document.querySelectorAll('.progress-text');
    progressBars.forEach(pt => {
        if (pt.querySelector('span').textContent === label) {
            pt.querySelector('span:last-child').textContent = value + '%';
            pt.previousElementSibling.querySelector('.progress-fill').style.width = value + '%';
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Ctrl/Cmd + U to focus upload
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        document.getElementById('fileInput').click();
    }
});

// Project management functions
function createProject(name) {
    const project = {
        id: Date.now(),
        name: name,
        files: [],
        createdAt: new Date().toISOString(),
        status: 'active'
    };
    
    projectStructure[project.id] = project;
    showNotification(`Project "${name}" created successfully!`, 'success');
    return project;
}

function deleteProject(projectId) {
    if (projectStructure[projectId]) {
        const projectName = projectStructure[projectId].name;
        delete projectStructure[projectId];
        showNotification(`Project "${projectName}" deleted.`, 'success');
    }
}

// Admin dashboard simulation
function showAdminDashboard() {
    const modal = document.getElementById('previewModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = '👑 Admin Dashboard';
    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            <div class="card" style="padding: 1rem;">
                <h4>👥 Users</h4>
                <div class="stat-value" style="font-size: 1.5rem;">1,234</div>
                <p style="color: var(--text-secondary);">Active users</p>
            </div>
            <div class="card" style="padding: 1rem;">
                <h4>📁 Projects</h4>
                <div class="stat-value" style="font-size: 1.5rem;">567</div>
                <p style="color: var(--text-secondary);">Total projects</p>
            </div>
            <div class="card" style="padding: 1rem;">
                <h4>💰 Revenue</h4>
                <div class="stat-value" style="font-size: 1.5rem;">$45.2K</div>
                <p style="color: var(--text-secondary);">This month</p>
            </div>
            <div class="card" style="padding: 1rem;">
                <h4>📊 Resources</h4>
                <div class="stat-value" style="font-size: 1.5rem;">78%</div>
                <p style="color: var(--text-secondary);">Utilization</p>
            </div>
        </div>
        <div style="margin-top: 1.5rem;">
            <h4>Recent Activity</h4>
            <ul class="component-list">
                <li>User john.doe@example.com created new project</li>
                <li>Deployment completed for project #1234</li>
                <li>System backup completed successfully</li>
                <li>New user registration: jane.smith@example.com</li>
            </ul>
        </div>
    `;

    modal.classList.add('active');
}

// Authentication simulation
function login(username, password) {
    // Simulate authentication
    showNotification('Authenticating...', 'info');
    
    setTimeout(() => {
        if (username && password) {
            showNotification(`Welcome back, ${username}!`, 'success');
            // Store auth state
            localStorage.setItem('authToken', 'simulated-token-' + Date.now());
            localStorage.setItem('username', username);
        } else {
            showNotification('Invalid credentials', 'error');
        }
    }, 1000);
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    showNotification('Logged out successfully', 'success');
}

// API access simulation
function generateApiKey() {
    const apiKey = 'ak_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    showNotification(`API Key generated: ${apiKey}`, 'success');
    return apiKey;
}

// Billing system simulation
function showBillingInfo() {
    const modal = document.getElementById('previewModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = '💰 Billing Information';
    modalBody.innerHTML = `
        <div class="card" style="padding: 1rem; margin-bottom: 1rem;">
            <h4>Current Plan: Enterprise</h4>
            <p style="color: var(--text-secondary);">Unlimited resources and priority support</p>
        </div>
        <div style="margin-bottom: 1rem;">
            <h4>Usage Summary</h4>
            <ul class="component-list">
                <li>Compute: 2,450 hours / Unlimited</li>
                <li>Storage: 45 TB / Unlimited</li>
                <li>Bandwidth: 8.9 TB / Unlimited</li>
                <li>API Calls: 1.2M / Unlimited</li>
            </ul>
        </div>
        <div>
            <h4>Current Bill: $0.00</h4>
            <p style="color: var(--text-secondary);">Next billing date: January 1, 2025</p>
        </div>
    `;

    modal.classList.add('active');
}

// Resource allocation control
function allocateResources(projectId, cpu, memory, storage) {
    showNotification(`Allocating resources: CPU ${cpu}%, Memory ${memory}%, Storage ${storage}GB`, 'info');
    
    setTimeout(() => {
        showNotification('Resources allocated successfully!', 'success');
    }, 1500);
}

// Backup and restore simulation
function createBackup() {
    showNotification('Creating backup...', 'info');
    
    setTimeout(() => {
        const backupId = 'backup-' + Date.now();
        showNotification(`Backup created: ${backupId}`, 'success');
    }, 3000);
}

function restoreBackup(backupId) {
    showNotification(`Restoring from backup: ${backupId}...`, 'info');
    
    setTimeout(() => {
        showNotification('Backup restored successfully!', 'success');
    }, 4000);
}

// Logging and analytics
function showLogs() {
    const modal = document.getElementById('previewModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = '📋 System Logs';
    modalBody.innerHTML = `
        <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem; max-height: 400px; overflow-y: auto;">
            <div style="color: var(--success-color);">[2024-01-15 10:23:45] INFO: System started successfully</div>
            <div style="color: var(--text-secondary);">[2024-01-15 10:23:46] INFO: Loading configuration...</div>
            <div style="color: var(--success-color);">[2024-01-15 10:23:47] INFO: All services operational</div>
            <div style="color: var(--warning-color);">[2024-01-15 10:24:12] WARN: High CPU usage detected (85%)</div>
            <div style="color: var(--text-secondary);">[2024-01-15 10:24:15] INFO: Auto-scaling triggered</div>
            <div style="color: var(--success-color);">[2024-01-15 10:24:20] INFO: New instance provisioned</div>
            <div style="color: var(--text-secondary);">[2024-01-15 10:25:00] INFO: Backup completed</div>
            <div style="color: var(--success-color);">[2024-01-15 10:26:34] INFO: User authentication successful</div>
            <div style="color: var(--text-secondary);">[2024-01-15 10:27:45] INFO: API request processed</div>
            <div style="color: var(--success-color);">[2024-01-15 10:28:12] INFO: Deployment completed</div>
        </div>
    `;

    modal.classList.add('active');
}

// Gateway server with IP routing
function configureGateway(ipAddress, routingRules) {
    showNotification(`Configuring gateway for IP: ${ipAddress}`, 'info');
    
    setTimeout(() => {
        showNotification('Gateway configured successfully!', 'success');
    }, 2000);
}

// Export functions for global access
window.CloudDashboard = {
    createProject,
    deleteProject,
    showAdminDashboard,
    login,
    logout,
    generateApiKey,
    showBillingInfo,
    allocateResources,
    createBackup,
    restoreBackup,
    showLogs,
    configureGateway
};