# LocalScene - Web Application

LocalScene is a Single Page Application (SPA) built using React, Vite, TailwindCSS, and Supabase. This guide provides comprehensive, step-by-step instructions for hosting and deploying the application.

We have pre-configured deployment support for **two primary hosting solutions**:
1. **Render.com** (Fully managed cloud hosting — Easiest, automated)
2. **RackNerd VPS** (Self-managed virtual private server — Full control, fast performance, highly economical)

---

# 🚀 Deployment and Hosting Guide

## 🌐 Option A: Managed Cloud Hosting via Render (Recommended)

Render offers fully managed hosting for static sites, providing automatic global CDN delivery, free automated SSL, and direct GitHub-triggered deploys.

### One-Click Blueprint Deployment
We have included a `render.yaml` Blueprint file at the root of the workspace. Render will automatically read this file to configure the entire stack.

1. Push your repository to **GitHub** (ensure the `render.yaml` is in the root directory).
2. Go to the [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Blueprint**.
3. Select and connect your GitHub repository.
4. Render will parse `render.yaml` and configure:
   * **Service Type**: Static Site (`localscene`)
   * **Root Directory**: `localscene` (monorepo build safety)
   * **Build Command**: `npm install && npm run build`
   * **Publish Directory**: `dist`
   * **Routing Rules**: Automatic redirect rewriting (`/* -> /index.html`) so that React Router links (e.g. `/artists`, `/login`) work flawlessly.
5. Click **Apply** to deploy the site!

---

## 🖥️ Option B: Self-Managed VPS Hosting via RackNerd

Hosting on a RackNerd VPS offers top-tier speed and absolute cost-efficiency. To support this, we have provided an optimized Nginx server block configuration and a deployment shell script.

### 1. Initialize Nginx on your RackNerd VPS
SSH into your RackNerd server and run these commands to set up the system and prepare it for hosting:

```bash
# Update software repositories and install Nginx
sudo apt update
sudo apt install nginx git -y

# Create the folder where your static site files will live
sudo mkdir -p /var/www/localscene/dist

# Set folder ownership so your user can deploy files without needing root access
sudo chown -R $USER:$USER /var/www/localscene
```

### 2. Configure the Nginx Web Server
Nginx is the web server that intercepts incoming traffic and serves the React frontend.
1. Create a new site configuration file on your VPS:
   ```bash
   sudo nano /etc/nginx/sites-available/localscene
   ```
2. Paste the contents of `localscene/deployment/nginx.conf` into this file.
3. Change the `server_name _;` line to include your actual domain name:
   ```nginx
   server_name yourdomain.com www.yourdomain.com;
   ```
4. Save and close the editor (`Ctrl+O`, `Enter`, `Ctrl+X`).
5. Enable the site and disable the Nginx default fallback:
   ```bash
   # Enable the LocalScene site
   sudo ln -s /etc/nginx/sites-available/localscene /etc/nginx/sites-enabled/
   
   # Remove the default Nginx welcome page configuration
   sudo rm -f /etc/nginx/sites-enabled/default
   ```
6. Verify your Nginx configuration contains no syntax errors and reload Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### 3. Deploy in One Click with `deploy.sh`
We have provided an automated deployment script `localscene/deployment/deploy.sh` that installs dependencies, builds the production bundle locally, and uploads it to your VPS.

1. Open `localscene/deployment/deploy.sh` in your editor.
2. Edit the configuration variables at the top of the file to match your VPS settings:
   ```bash
   VPS_USER="root"                       # Your SSH username (usually root or ubuntu)
   VPS_HOST="your_vps_ip_here"           # Replace with your RackNerd VPS IP Address
   VPS_DEST_DIR="/var/www/localscene"     # Target folder on your VPS
   ```
3. Open your terminal in the `localscene/deployment` directory and make the script executable:
   ```bash
   chmod +x deploy.sh
   ```
4. Run the script:
   ```bash
   ./deploy.sh
   ```
   *The script will automatically compile your code, verify the build, and use secure `rsync` over SSH to push the `dist/` directory directly to your RackNerd server.*

### 4. 🔒 Secure with Free SSL (HTTPS)
To secure your user sessions, secure password logins, and enable HTTPS, you should install a free SSL certificate from Let's Encrypt:

1. Install Certbot on your RackNerd server:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```
2. Generate and apply the SSL certificate automatically:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```
3. Follow the interactive prompts. Certbot will handle the verification process, modify your Nginx file automatically to enable HTTPS, and set up a daily task to auto-renew the certificates.

---

## 📂 Option C: Shared Hosting via cPanel (GoDaddy, Namecheap, Bluehost, etc.)

If you are using standard shared hosting with **cPanel**, your server runs Apache. We have added a [.htaccess](file:///c:/Users/thanu/OneDrive/Documents/GitHub/LocalScene/localscene/public/.htaccess) configuration file inside `localscene/public/` so that it is automatically bundled during your build to enable clean React Router SPA navigation.

### Step-by-Step cPanel Upload Instructions:
1. Open your terminal in the `localscene/` directory and run the production build command:
   ```bash
   npm run build
   ```
2. Navigate to your local `localscene/dist/` directory.
3. Compress (Zip) all the files and folders *inside* the `dist/` directory (including `assets/`, `index.html`, and `.htaccess`).
   > [!IMPORTANT]
   > Make sure you select the files inside the folder and zip them directly, rather than zipping the outer `dist/` folder itself.
4. Log into your **cPanel Dashboard**.
5. Click on **File Manager** and navigate to your website's root directory (typically **`public_html`**).
6. Upload the zipped file to the server.
7. Right-click the uploaded zip file in cPanel File Manager and choose **Extract**.
8. Verify that the `.htaccess` file was successfully extracted in the directory (if you cannot see it, enable "Show Hidden Files" in cPanel's File Manager settings cog at the top right).

---

# 🛠️ Local Development

### 1. Installation
Install all required Node packages inside the project subdirectory:
```bash
cd localscene
npm install
```

### 2. Run in Development
Start Vite's live hot-reloading development server:
```bash
npm run dev
```

### 3. Build for Production
Pre-compile and bundle files into optimized assets inside the `dist` folder:
```bash
npm run build
```
