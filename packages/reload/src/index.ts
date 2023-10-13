declare const {io}: typeof import("socket.io-client");
type ReloadBody = {css: number, ui: number}

export async function reloader() {
  const socket = io();

  let latest: ReloadBody = {css: 0, ui: 0}
  await new Promise<void>(res => {
    socket.on("start", (l: ReloadBody) => {
      latest = l;
      res();
    })
  })
  socket.on("disconnect", () => {
    if (confirm("Connection lost. Reload?")){
      location.reload();
    }
    else {
      socket.close();
    }
  })
  socket.on("change", (body: ReloadBody) => {
    if (latest.ui < body.ui) {
      if (latest.ui > 0) {
        reloadUi();
      }
      latest.ui = body.ui;
    }

    else if (latest.css < body.css) {
      if (latest.css > 0) {
        reloadCss();
      }
      latest.css = body.css;
    }
  });
}

function reloadUi() {
  location.reload();
}

function reloadCss() {
  for (const link of document.querySelectorAll("link")) {
    if (link.rel == "stylesheet") {
      const copy = link.cloneNode(true);
      link.replaceWith(copy);
    }
  }
}