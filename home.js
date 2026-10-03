/* ============================================================
   GEONEXA AI — LANDING PAGE JAVASCRIPT
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------------------
       CURRENT YEAR
       --------------------------------------------------------- */

    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* ---------------------------------------------------------
       NAVBAR SCROLL EFFECT
       --------------------------------------------------------- */

    const navbar = document.getElementById("navbar");

    function updateNavbar() {

        if (!navbar) return;

        if (window.scrollY > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    }

    window.addEventListener("scroll", updateNavbar);

    updateNavbar();


    /* ---------------------------------------------------------
       SCROLL REVEAL
       --------------------------------------------------------- */

    const revealElements =
        document.querySelectorAll(".reveal");

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach((element) => {
        observer.observe(element);
    });


    /* ---------------------------------------------------------
       SMOOTH NAVIGATION
       --------------------------------------------------------- */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener("click", (event) => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });


    /* ---------------------------------------------------------
       MOBILE MENU
       --------------------------------------------------------- */

    const menuBtn =
        document.getElementById("menuBtn");

    const navLinks =
        document.querySelector(".nav-links");

    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", () => {

            const isOpen =
                navLinks.classList.toggle("mobile-open");

            if (isOpen) {

                navLinks.style.display = "flex";

                navLinks.style.position = "absolute";
                navLinks.style.top = "68px";
                navLinks.style.left = "15px";
                navLinks.style.right = "15px";

                navLinks.style.flexDirection = "column";
                navLinks.style.alignItems = "stretch";

                navLinks.style.padding = "20px";

                navLinks.style.border =
                    "1px solid rgba(117,231,220,0.16)";

                navLinks.style.borderRadius = "16px";

                navLinks.style.background =
                    "rgba(3,19,17,0.97)";

                navLinks.style.backdropFilter =
                    "blur(20px)";

                navLinks.style.gap = "18px";

            } else {

                navLinks.removeAttribute("style");

            }

        });


        /* Close menu when a link is clicked */

        navLinks
            .querySelectorAll("a")
            .forEach((link) => {

                link.addEventListener("click", () => {

                    navLinks.classList.remove(
                        "mobile-open"
                    );

                    if (
                        window.innerWidth <= 980
                    ) {
                        navLinks.removeAttribute(
                            "style"
                        );
                    }

                });

            });

    }


    /* ---------------------------------------------------------
       HERO VISUAL — SUBTLE PARALLAX
       --------------------------------------------------------- */

    const heroVisual =
        document.querySelector(".hero-visual");

    if (heroVisual) {

        window.addEventListener("mousemove", (event) => {

            if (window.innerWidth < 900) return;

            const x =
                (window.innerWidth / 2 - event.clientX)
                / 80;

            const y =
                (window.innerHeight / 2 - event.clientY)
                / 100;

            heroVisual.style.transform =
                `translate(${x}px, ${y}px)`;

        });

    }


    /* ---------------------------------------------------------
       LIVE SPATIAL TEXT
       --------------------------------------------------------- */

    const liveText =
        document.querySelector(".live");

    if (liveText) {

        const states = [
            "LIVE SPATIAL VIEW",
            "SCANNING LOCATION",
            "ANALYZING TERRAIN",
            "GIS INTELLIGENCE READY"
        ];

        let index = 0;

        setInterval(() => {

            index = (index + 1) % states.length;

            liveText.textContent =
                states[index];

        }, 4000);

    }

});
