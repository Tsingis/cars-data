;(function () {
  const dataUrlString = "__DATA_URL__"

  if (dataUrlString.trim()) {
    const dataUrl = new URL(dataUrlString)
    const head = document.head

    const dnsPrefectLink = document.createElement("link")
    dnsPrefectLink.rel = "dns-prefetch"
    dnsPrefectLink.href = dataUrl.origin
    head.appendChild(dnsPrefectLink)

    const preloadLink = document.createElement("link")
    preloadLink.rel = "preload"
    preloadLink.href = dataUrl
    preloadLink.as = "fetch"
    preloadLink.crossOrigin = "anonymous"
    head.appendChild(preloadLink)
  }
})()
