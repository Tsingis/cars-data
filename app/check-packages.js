import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import { Buffer } from "buffer"

const packageLockPath = path.resolve("package-lock.json")
const nodeModulesPath = path.resolve("node_modules")
const nodeModulesMarkerFile = path.join(nodeModulesPath, ".package-lock.json")

function getPackageLockHash() {
  try {
    const lockFileContent = fs.readFileSync(packageLockPath)
    return Buffer.from(lockFileContent).toString("base64").substring(0, 32)
  } catch (error) {
    console.error("Cannot read package-lock.json:", error.message)
    return null
  }
}

function getStoredHash() {
  if (fs.existsSync(nodeModulesMarkerFile)) {
    return fs.readFileSync(nodeModulesMarkerFile, "utf8")
  }
  return null
}

function updateStoredHash(hash) {
  try {
    fs.writeFileSync(nodeModulesMarkerFile, hash)
    console.log("node_modules is now in sync with package-lock.json")
  } catch (error) {
    console.error("Cannot update node_modules marker file:", error.message)
  }
}

function installDependencies() {
  console.log("Installing dependencies...")
  try {
    execSync("npm install", { stdio: "inherit" })
    return true
  } catch (error) {
    console.error("Failed to install dependencies:", error.message)
    return false
  }
}

function checkPackages() {
  if (!fs.existsSync(nodeModulesPath)) {
    console.log("node_modules not found. Installing dependencies...")
    if (installDependencies()) {
      updateStoredHash(getPackageLockHash())
    }
    return
  }

  const currentHash = getPackageLockHash()
  const storedHash = getStoredHash()

  if (currentHash !== storedHash) {
    console.log("node_modules is out of sync with package-lock.json")
    if (installDependencies()) {
      updateStoredHash(currentHash)
    }
  } else {
    console.log("node_modules is in sync with package-lock.json")
  }
}

checkPackages()
