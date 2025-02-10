;(function () {
  const isLocalhost = window.location.hostname === "localhost"

  if (!isLocalhost) {
    const head = document.head
    const dataUrl = new URL("__DATA_URL__")

    const preconnectLink = document.createElement("link")
    preconnectLink.rel = "preconnect"
    preconnectLink.href = dataUrl.origin
    head.appendChild(preconnectLink)

    const preloadLink = document.createElement("link")
    preloadLink.rel = "preload"
    preloadLink.href = dataUrl
    preloadLink.as = "fetch"
    preloadLink.crossOrigin = "anonymous"
    head.appendChild(preloadLink)
  }
})()
