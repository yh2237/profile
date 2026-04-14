fetch("data/README.local.md", { cache: "no-cache" })
    .then(res => res.text())
    .then(md => {
        document.getElementById("profile-readme").innerHTML = marked.parse(md);
    });
