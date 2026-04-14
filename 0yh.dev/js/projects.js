document.addEventListener("DOMContentLoaded", () => {
    const tocList = document.getElementById("projects-toc-list");
    const projectsList = document.getElementById("projects-list");

    if (!tocList || !projectsList) {
        return;
    }

    function createLinkIcon(iconName) {
        const icon = document.createElement("i");
        icon.className = "iconify";
        icon.setAttribute("data-icon", iconName || "simple-icons:link");
        return icon;
    }

    function createExternalLink(link) {
        const anchor = document.createElement("a");
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.appendChild(createLinkIcon(link.icon));
        anchor.append(document.createTextNode(` ${link.label}`));
        return anchor;
    }

    function createEmbed(embed) {
        const wrapper = document.createElement("div");
        wrapper.className = "project-embed";

        const script = document.createElement("script");
        script.type = "application/javascript";
        script.src = embed.scriptSrc;
        wrapper.appendChild(script);

        const noscript = document.createElement("noscript");
        const fallback = document.createElement("a");
        fallback.href = embed.fallbackUrl;
        fallback.textContent = embed.fallbackText || embed.fallbackUrl;
        noscript.appendChild(fallback);
        wrapper.appendChild(noscript);

        return wrapper;
    }

    function createProjectCard(project) {
        const section = document.createElement("section");
        section.className = "project-card";
        section.id = project.id;

        const title = document.createElement("h3");
        title.textContent = `- ${project.title}`;
        section.appendChild(title);

        if (project.image && project.image.src) {
            const image = document.createElement("img");
            image.src = project.image.src;
            image.alt = project.image.alt || project.title;
            image.className = "project-image";
            section.appendChild(image);
        }

        if (project.embed && project.embed.scriptSrc) {
            section.appendChild(createEmbed(project.embed));
        }

        if (Array.isArray(project.description) && project.description.length > 0) {
            const paragraph = document.createElement("p");
            project.description.forEach((line, index) => {
                if (index > 0) {
                    paragraph.appendChild(document.createElement("br"));
                }
                paragraph.append(document.createTextNode(line));
            });
            section.appendChild(paragraph);
        }

        if (project.installCommand) {
            const install = document.createElement("p");
            install.className = "project-install";
            const code = document.createElement("code");
            code.textContent = project.installCommand;
            install.appendChild(code);
            section.appendChild(install);
        }

        if (Array.isArray(project.links) && project.links.length > 0) {
            const links = document.createElement("div");
            links.className = "project-links";
            project.links.forEach((link) => {
                if (link.url && link.label) {
                    links.appendChild(createExternalLink(link));
                }
            });
            section.appendChild(links);
        }

        return section;
    }

    function renderProjects(projects) {
        tocList.innerHTML = "";
        projectsList.innerHTML = "";

        projects.forEach((project) => {
            if (!project.id || !project.title) {
                return;
            }

            const tocItem = document.createElement("li");
            const tocAnchor = document.createElement("a");
            tocAnchor.href = `#${project.id}`;
            tocAnchor.textContent = project.title;
            tocItem.appendChild(tocAnchor);
            tocList.appendChild(tocItem);

            projectsList.appendChild(createProjectCard(project));
        });

        if (window.Iconify && typeof window.Iconify.scan === "function") {
            window.Iconify.scan(projectsList);
        }
    }

    async function loadProjects() {
        try {
            const res = await fetch("data/projects.json", { cache: "no-cache" });
            if (!res.ok) {
                throw new Error(`HTTP error ${res.status}`);
            }

            const data = await res.json();
            const projects = Array.isArray(data.projects) ? data.projects : [];
            renderProjects(projects);

            if (projects.length === 0) {
                const emptyMessage = document.createElement("p");
                emptyMessage.className = "projects-message";
                emptyMessage.textContent = "表示できるプロジェクトがありません。";
                projectsList.appendChild(emptyMessage);
            }
        } catch (error) {
            console.error("Failed to load projects:", error);
            const errorMessage = document.createElement("p");
            errorMessage.className = "projects-message";
            errorMessage.textContent = "Projectsの読み込みに失敗しました。";
            projectsList.innerHTML = "";
            tocList.innerHTML = "";
            projectsList.appendChild(errorMessage);
        }
    }

    loadProjects();
});
