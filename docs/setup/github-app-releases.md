# Setting Up GitHub App for Automated Releases

This guide walks you through creating and configuring a GitHub App to enable automated releases and pull request creation in your Precast repository or fork.

## Why Use a GitHub App?

GitHub Apps provide several advantages over Personal Access Tokens (PATs):
- ✅ **No expiration** - Apps don't expire like PATs
- ✅ **Fine-grained permissions** - Only grant what's needed
- ✅ **Better security** - Private keys instead of tokens
- ✅ **Organization-friendly** - Easy to manage across teams

## Step 1: Create a GitHub App

### For Personal Account
1. Go to **Settings** → **Developer settings** → **GitHub Apps**
2. Click **New GitHub App**

### For Organization
1. Go to your organization's settings
2. Navigate to **Developer settings** → **GitHub Apps**
3. Click **New GitHub App**

## Step 2: Configure Your GitHub App

Fill in the following details:

### Basic Information
- **GitHub App name**: `Precast Release Bot` (or your preferred name)
- **Homepage URL**: `https://github.com/yourusername/precast-app`
- **Description**: `Automated release management for Precast`

### Webhook
- **Active**: ❌ Uncheck (not needed for releases)

### Permissions

#### Repository Permissions
Set the following permissions:

| Permission | Access Level | Purpose |
|------------|--------------|---------|
| **Actions** | `Read` | View workflow runs |
| **Contents** | `Write` | Push commits and tags |
| **Issues** | `Write` | Create release issues |
| **Metadata** | `Read` | Default (required) |
| **Pull requests** | `Write` | Create and merge PRs |
| **Deployments** | `Write` | Create deployment statuses |
| **Checks** | `Write` | Create check runs |
| **Commit statuses** | `Write` | Update commit status |

#### Account Permissions
No account permissions needed.

### Where can this GitHub App be installed?
- Choose **Only on this account** for personal use
- Choose **Any account** if you want others to use it

## Step 3: Create and Save Your App

1. Click **Create GitHub App**
2. You'll be redirected to your app's settings page
3. Note down your **App ID** (you'll need this later)

## Step 4: Generate a Private Key

1. Scroll down to **Private keys** section
2. Click **Generate a private key**
3. A `.pem` file will download - **keep this secure!**

## Step 5: Install the App on Your Repository

1. In your app settings, click **Install App** in the left sidebar
2. Choose your account or organization
3. Select **Only select repositories**
4. Choose your `precast-app` repository
5. Click **Install**

## Step 6: Add Secrets to Your Repository

Navigate to your repository's **Settings** → **Secrets and variables** → **Actions**

Add these two secrets:

### 1. APP_ID
- Click **New repository secret**
- Name: `APP_ID`
- Value: Your App ID from Step 3

### 2. APP_PRIVATE_KEY
- Click **New repository secret**
- Name: `APP_PRIVATE_KEY`
- Value: Contents of the `.pem` file from Step 4
  
**Important**: Copy the entire contents including:
```
-----BEGIN RSA PRIVATE KEY-----
[your key content]
-----END RSA PRIVATE KEY-----
```

## Step 7: Workflow Configuration

The release workflow (`release.yml`) automatically supports three authentication methods in order of preference:

1. **GitHub App** (recommended) - Never expires, most secure
2. **Personal Access Token** - Simple setup, requires renewal
3. **Default GITHUB_TOKEN** - Fallback, requires repository settings

The workflow will automatically use the best available method:

```yaml
# The workflow tries in order:
# 1. GitHub App (if APP_ID and APP_PRIVATE_KEY are set)
# 2. Personal Access Token (if RELEASE_TOKEN is set)
# 3. Default GITHUB_TOKEN (always available)

- name: Generate GitHub App Token
  id: app-token
  uses: actions/create-github-app-token@v1
  continue-on-error: true  # Don't fail if app not configured
  with:
    app-id: ${{ secrets.APP_ID }}
    private-key: ${{ secrets.APP_PRIVATE_KEY }}

- name: Checkout
  uses: actions/checkout@v4
  with:
    # Uses app token, then PAT, then default token
    token: ${{ steps.app-token.outputs.token || secrets.RELEASE_TOKEN || secrets.GITHUB_TOKEN }}
```

No workflow changes needed - just add your preferred authentication method!

## Verification

To verify your setup:

1. Make a change to your code
2. Create a changeset: `pnpm changeset`
3. Commit and push to main
4. Check Actions tab - the workflow should create a PR automatically

## Troubleshooting

### Error: "GitHub Actions is not permitted to create pull requests"
- Ensure your GitHub App has `Pull requests: Write` permission
- Verify the app is installed on your repository

### Error: "Bad credentials"
- Check that `APP_ID` and `APP_PRIVATE_KEY` secrets are set correctly
- Ensure the private key includes the BEGIN/END markers

### Error: "This endpoint requires authentication"
- The token generation step might have failed
- Check the logs of the "Generate GitHub App Token" step

### Error: "Resource not accessible by integration"
- Your app might not have sufficient permissions
- Review and update app permissions, then reinstall

## Alternative: Using Personal Access Token (PAT)

If you prefer a simpler setup with a PAT:

1. Create a PAT with `repo` and `workflow` scopes
2. Add it as `RELEASE_TOKEN` secret
3. Use `${{ secrets.RELEASE_TOKEN }}` in your workflow

**Note**: PATs expire and need regular renewal.

## Security Best Practices

1. **Never commit** your private key or tokens
2. **Rotate keys** periodically
3. **Limit permissions** to minimum required
4. **Use environment** protection rules for production
5. **Audit logs** regularly in Settings → Audit log

## For Forked Repositories

If you've forked Precast:

1. Create your own GitHub App following steps above
2. Install it on your fork
3. Add your app's secrets to your fork
4. The workflow will use your app for releases

## Need Help?

- [GitHub Apps Documentation](https://docs.github.com/en/developers/apps)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [Create GitHub App Token Action](https://github.com/actions/create-github-app-token)

---

*Last updated: January 2025*