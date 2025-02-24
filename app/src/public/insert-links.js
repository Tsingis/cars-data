;(function () {
  let dataUrl
  try {
    dataUrl = new URL("__DATA_URL__")
  } catch {
    dataUrl = new URL("http://localhost:8000/data/data.json")
  }

  const head = document.head

  const preconnectLink = document.createElement("link")
  preconnectLink.rel = "preconnect"
  preconnectLink.href = dataUrl.origin
  preconnectLink.crossOrigin = "anonymous"
  head.appendChild(preconnectLink)

  const dnsPrefetchLink = document.createElement("link")
  dnsPrefetchLink.rel = "dns-prefetch"
  dnsPrefetchLink.href = dataUrl.origin
  head.appendChild(dnsPrefetchLink)

  const preloadLink = document.createElement("link")
  preloadLink.rel = "preload"
  preloadLink.href = dataUrl
  preloadLink.as = "fetch"
  preloadLink.crossOrigin = "anonymous"
  head.appendChild(preloadLink)
})()
