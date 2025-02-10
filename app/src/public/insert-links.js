;(function () {
  const dataUrlString = "__DATA_URL__"

  if (dataUrlString.trim()) {
    const dataUrl = new URL(dataUrlString)
    const head = document.head

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
