/*=============== SCROLL PROGRESS BAR ===============*/
(function() {
    const bar = document.createElement("div");
    bar.id = "scroll-progress";
    document.body.prepend(bar);

    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = ((scrolled / max) * 100).toFixed(2) + "%";
    }, { passive: true });
})();

/*=============== PARTICLE CANVAS ===============*/
(function() {
    const canvas = document.createElement("canvas");
    canvas.id = "particle-canvas";
    document.body.prepend(canvas);
    const ctx = canvas.getContext("2d");

    let W, H, particles = [];
    const COUNT = window.innerWidth < 768 ? 35 : 70;
    const COLOR = "hsla(250, 66%, 75%,";

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function rand(min, max) { return Math.random() * (max - min) + min; }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = rand(0, W);
            this.y = rand(0, H);
            this.r = rand(0.5, 2.5);
            this.vx = rand(-0.15, 0.15);
            this.vy = rand(-0.4, -0.08);
            this.opacity = rand(0.1, 0.5);
            this.life = 0;
            this.maxLife = rand(200, 500);
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life++;
            if (this.life > this.maxLife || this.y < -10) this.reset();
        }
        draw() {
            const progress = this.life / this.maxLife;
            const alpha = this.opacity * (1 - progress);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = COLOR + alpha + ")";
            ctx.fill();
        }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    // Connection lines between nearby particles
    function drawConnections() {
        const maxDist = 100;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    ctx.beginPath();
                    ctx.strokeStyle = COLOR + (0.05 * (1 - dist / maxDist)) + ")";
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Mouse repulsion
    let mouse = { x: -999, y: -999 };
    window.addEventListener("mousemove", e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    function animate() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            // Gentle mouse repulsion
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) {
                p.vx += (dx / dist) * 0.04;
                p.vy += (dy / dist) * 0.04;
                p.vx *= 0.97;
                p.vy *= 0.97;
            }
            p.update();
            p.draw();
        });
        if (window.innerWidth > 500) drawConnections();
        requestAnimationFrame(animate);
    }
    animate();
})();

/*=============== CUSTOM CURSOR ===============*/
(function() {
    if (window.innerWidth < 992) return;
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.append(dot, ring);

    let mx = 0,
        my = 0,
        rx = 0,
        ry = 0;
    document.addEventListener("mousemove", e => {
        mx = e.clientX;
        my = e.clientY;
    });

    function tick() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        dot.style.left = mx + "px";
        dot.style.top = my + "px";
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
        requestAnimationFrame(tick);
    }
    tick();

    document.querySelectorAll("a, button, .work__item, .services__button, .about__box, .work__card, .services__card, .contact__card").forEach(el => {
        el.addEventListener("mouseenter", () => ring.classList.add("hovered"));
        el.addEventListener("mouseleave", () => ring.classList.remove("hovered"));
    });
})();

/*=============== SCROLL TO TOP BUTTON ===============*/
(function() {
    const btn = document.createElement("button");
    btn.id = "scroll-top";
    btn.innerHTML = "<i class='bx bx-up-arrow-alt'></i>";
    btn.title = "Back to top";
    document.body.appendChild(btn);

    window.addEventListener("scroll", () => {
        btn.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader() {
    const header = document.getElementById("header");
    if (this.scrollY >= 50) header.classList.add("scroll-header");
    else header.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader, { passive: true });



/*=============== SERVICES INLINE EXPAND ===============*/
document.querySelectorAll(".services__button").forEach(btn => {
    btn.addEventListener("click", () => {
        const card = btn.closest(".services__card");
        const short = card.querySelector(".services__desc--short");
        const full = card.querySelector(".services__desc--full");
        const expanded = full.style.display === "block";

        if (expanded) {
            full.style.display = "none";
            short.style.display = "-webkit-box";
            btn.innerHTML = "See More <i class='bx bx-right-arrow services__icon'></i>";
        } else {
            full.style.display = "block";
            short.style.display = "none";
            btn.innerHTML = "See Less <i class='bx bx-down-arrow services__icon'></i>";
        }
    });
});

/*=============== MIXITUP FILTER PORTFOLIO ===============*/
let mixer = mixitup(".work__container", {
    selectors: { target: ".work__card" },
    animation: { duration: 350, effects: "fade translateY(30px) scale(.9)" },
});

const workLinks = document.querySelectorAll(".work__item");

function activeWork(workLink) {
    workLinks.forEach(wl => wl.classList.remove("active-work"));
    workLink.classList.add("active-work");
}

workLinks.forEach(wl => {
    wl.addEventListener("click", () => activeWork(wl));
});

/*=============== SWIPER TESTIMONIAL ===============*/
let swiperTestimonial = new Swiper(".testimonial__container", {
    spaceBetween: 24,
    loop: true,
    grabCursor: true,
    speed: 700,
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    breakpoints: {
        576: { slidesPerView: 2 },
        768: { slidesPerView: 2, spaceBetween: 48 },
    },
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
    const scrollY = window.pageYOffset;
    sections.forEach((current) => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute("id");
        const link = document.querySelector(".nav__menu a[href*=" + sectionId + "]");
        if (!link) return;
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            link.classList.add("active-link");
        } else {
            link.classList.remove("active-link");
        }
    });
}
window.addEventListener("scroll", scrollActive, { passive: true });

/*=============== LIGHT DARK THEME ===============*/
const themeButton = document.getElementById("theme-button");
const lightTheme = "light-theme";
const iconTheme = "bx-sun";

const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

const getCurrentTheme = () =>
    document.body.classList.contains(lightTheme) ? "dark" : "light";
const getCurrentIcon = () =>
    themeButton.classList.contains(iconTheme) ? "bx bx-moon" : "bx bx-sun";

if (selectedTheme) {
    document.body.classList[selectedTheme === "dark" ? "add" : "remove"](lightTheme);
    themeButton.classList[selectedIcon === "bx bx-moon" ? "add" : "remove"](iconTheme);
}

themeButton.addEventListener("click", () => {
    document.body.classList.toggle(lightTheme);
    themeButton.classList.toggle(iconTheme);
    localStorage.setItem("selected-theme", getCurrentTheme());
    localStorage.setItem("selected-icon", getCurrentIcon());
});

/*=============== ENHANCED SCROLL REVEAL ===============*/
const sr = ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 2500,
    delay: 400,
    reset: true,
});

sr.reveal(`.nav__menu`, { delay: 100, scale: 0.1, origin: "bottom", distance: "300px" });
sr.reveal(`.home__data`);
sr.reveal(`.home__handle`, { delay: 100 });
sr.reveal(`.home__social, .home__scroll`, { delay: 100, origin: "bottom" });
sr.reveal(`.about__img`, { delay: 100, origin: "left", scale: 0.9, distance: "30px" });
sr.reveal(`.about__data, .about__description, .about__button-contact`, { delay: 100, scale: 0.9, origin: "right", distance: "30px" });
sr.reveal(`.skills__content`, { delay: 100, scale: 0.9, origin: "bottom", distance: "30px" });
sr.reveal(`.services__title, services__button`, { delay: 100, scale: 0.9, origin: "top", distance: "30px" });
sr.reveal(`.work__card`, { delay: 100, scale: 0.9, origin: "bottom", distance: "30px" });
sr.reveal(`.testimonial__container`, { delay: 100, scale: 0.9, origin: "bottom", distance: "30px" });
sr.reveal(`.contact__info, .contact__title-info`, { delay: 100, scale: 0.9, origin: "left", distance: "30px" });
sr.reveal(`.contact__form, .contact__title-form`, { delay: 100, scale: 0.9, origin: "right", distance: "30px" });
sr.reveal(`.footer, footer__container`, { delay: 100, scale: 0.9, origin: "bottom", distance: "30px" });

/*=============== INTERSECTION OBSERVER — SECTION TITLE UNDERLINE ===============*/
const observeTitle = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("title-animated");
    });
}, { threshold: 0.3 });

document.querySelectorAll(".section__title").forEach(t => observeTitle.observe(t));

/*=============== SKILL PROGRESS BARS ===============*/
// Add bar markup after each skills__data entry
(function injectSkillBars() {
    const skillMap = {
        "Java": 75,
        "HTML5": 85,
        "CSS3": 80,
        "JavaScript": 60,
        "MySQL": 65,
        "PHP": 55,
        "C": 70,
        "Network Security": 72,
        "Cryptography": 65,
        "Ethical Hacking": 68,
        "System Administration": 60,
        "Threat Analysis": 63,
        "Vulnerability Assessment": 60
    };

    document.querySelectorAll(".skills__data").forEach(item => {
        const nameEl = item.querySelector(".skills__name");
        if (!nameEl) return;
        const name = nameEl.textContent.trim();
        const pct = skillMap[name] || 65;

        const wrap = document.createElement("div");
        wrap.className = "skills__bar-wrap";
        const bar = document.createElement("div");
        bar.className = "skills__bar";
        bar.style.setProperty("--bar-width", pct + "%");
        wrap.appendChild(bar);
        item.querySelector("div").appendChild(wrap);
    });

    // Animate bars when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll(".skills__bar").forEach(bar => {
                    setTimeout(() => {
                        bar.style.width = bar.style.getPropertyValue("--bar-width") || "70%";
                    }, 100);
                });
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".skills__content").forEach(el => observer.observe(el));
})();

/*=============== SERVICES CARD — MOUSE GLOW EFFECT ===============*/
document.querySelectorAll(".services__card").forEach(card => {
    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        card.style.setProperty("--mouse-x", x + "%");
        card.style.setProperty("--mouse-y", y + "%");
    });
});

/*=============== STAGGERED SECTION ENTRANCE ===============*/
(function() {
    const items = [
        { sel: ".about__box", delay: 100 },
        { sel: ".skills__data", delay: 80 },
        { sel: ".services__card", delay: 120 },
        { sel: ".work__card", delay: 100 },
        { sel: ".contact__card", delay: 100 },
    ];

    items.forEach(({ sel, delay }) => {
        const els = document.querySelectorAll(sel);
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const el = e.target;
                    const idx = [...els].indexOf(el);
                    el.style.transitionDelay = (idx * delay) + "ms";
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0) scale(1)";
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.15 });

        els.forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px) scale(0.95)";
            el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            obs.observe(el);
        });
    });
})();

/*=============== TYPEWRITER EFFECT FOR EDUCATION TEXT ===============*/
(function() {
    const el = document.querySelector(".home__education");
    if (!el) return;
    const text = el.textContent.trim();
    el.textContent = "";
    el.style.borderRight = "2px solid var(--first-color)";
    el.style.display = "inline-block";
    el.style.overflow = "hidden";
    el.style.whiteSpace = "nowrap";

    let i = 0;
    const speed = 45;
    const delay = 1200;

    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i++);
            setTimeout(type, speed);
        } else {
            // Blinking cursor after done
            let visible = true;
            const blink = setInterval(() => {
                el.style.borderColor = visible ? "var(--first-color)" : "transparent";
                visible = !visible;
            }, 530);
            setTimeout(() => {
                clearInterval(blink);
                el.style.borderRight = "none";
                el.style.overflow = "visible";
                el.style.whiteSpace = "normal";
            }, 4000);
        }
    }

    setTimeout(type, delay);
})();

/*=============== RIPPLE EFFECT ON BUTTONS ===============*/
document.querySelectorAll(".button").forEach(btn => {
    btn.addEventListener("click", function(e) {
        const ripple = document.createElement("span");
        const rect = this.getBoundingClientRect();
        ripple.style.cssText = `
      position: absolute;
      width: 10px; height: 10px;
      background: rgba(255,255,255,0.4);
      border-radius: 50%;
      top: ${e.clientY - rect.top}px;
      left: ${e.clientX - rect.left}px;
      transform: translate(-50%,-50%) scale(0);
      animation: rippleEffect 0.6s ease forwards;
      pointer-events: none;
      z-index: 10;
    `;

        // Inject keyframe if not present
        if (!document.getElementById("ripple-style")) {
            const style = document.createElement("style");
            style.id = "ripple-style";
            style.textContent = `
        @keyframes rippleEffect {
          0% { transform: translate(-50%,-50%) scale(0); opacity: 0.7; }
          100% { transform: translate(-50%,-50%) scale(20); opacity: 0; }
        }
      `;
            document.head.appendChild(style);
        }

        this.style.position = "relative";
        this.style.overflow = "hidden";
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });
});

/*=============== NAV LINK TOOLTIP LABELS ===============*/
(function() {
    const labels = {
        "#home": "Home",
        "#about": "About",
        "#skills": "Skills",
        "#work": "Work",
        "#contact": "Contact"
    };
    document.querySelectorAll(".nav__link").forEach(link => {
        const href = link.getAttribute("href");
        if (labels[href]) link.setAttribute("title", labels[href]);
    });
})();

/*=============== SMOOTH COUNTER FOR ABOUT BOXES ===============*/
(function() {
    const boxes = document.querySelectorAll(".about__box");
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.animation = "none";
                e.target.offsetHeight; // reflow
                e.target.style.animation = "bounceIn 0.6s ease forwards";
                obs.unobserve(e.target);
            }
        });

        // Inject bounceIn if needed
        if (!document.getElementById("anim-style")) {
            const s = document.createElement("style");
            s.id = "anim-style";
            s.textContent = `
        @keyframes bounceIn {
          0% { opacity:0; transform:scale(0.3); }
          20% { transform:scale(1.1); }
          40% { transform:scale(0.9); }
          60% { opacity:1; transform:scale(1.03); }
          80% { transform:scale(0.97); }
          100% { opacity:1; transform:scale(1); }
        }
      `;
            document.head.appendChild(s);
        }
    }, { threshold: 0.3 });

    boxes.forEach((b, i) => {
        b.style.opacity = "0";
        setTimeout(() => obs.observe(b), i * 100);
    });
})();

/*=============== CONTACT FORM ENHANCED UX ===============*/
(function() {
    const inputs = document.querySelectorAll(".contact__form-input");
    inputs.forEach(inp => {
        inp.addEventListener("focus", () => {
            inp.parentElement.style.transform = "scale(1.01)";
        });
        inp.addEventListener("blur", () => {
            inp.parentElement.style.transform = "scale(1)";
        });
    });
})();

/*=============== WORK CARD IMAGE OVERLAY ON HOVER ===============*/
(function() {
    document.querySelectorAll(".work__card").forEach(card => {
        const img = card.querySelector(".work__img");
        if (!img) return;
        img.style.transition = "transform 0.5s cubic-bezier(0.4,0,0.2,1)";
        card.addEventListener("mouseenter", () => img.style.transform = "scale(1.05)");
        card.addEventListener("mouseleave", () => img.style.transform = "scale(1)");
    });
})();

/*=============== FOOTER SOCIAL LINK PULSE ON HOVER ===============*/
document.querySelectorAll(".footer__social-link").forEach((link, i) => {
    link.style.transitionDelay = (i * 60) + "ms";
});

/*=============== RESPONSIVE HELPER — VIEWPORT SIZE CLASS ===============*/
(function() {
    function setViewportClass() {
        const w = window.innerWidth;
        document.documentElement.dataset.viewport =
            w < 576 ? "xs" : w < 768 ? "sm" : w < 992 ? "md" : w < 1200 ? "lg" : "xl";
    }
    setViewportClass();
    window.addEventListener("resize", setViewportClass, { passive: true });
})();

/*=============== SECTION TRANSITION GLOW ===============*/
(function() {
    const sections = document.querySelectorAll(".section");
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.transition = "none";
            }
        });
    }, { threshold: 0.05 });
    sections.forEach(s => obs.observe(s));
})();

/*=============== NAV MENU BOUNCE ON LOAD ===============*/
window.addEventListener("load", () => {
    const menu = document.querySelector(".nav__menu");
    if (menu) {
        menu.style.animation = "slideUpBounce 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both";
        if (!document.getElementById("nav-anim")) {
            const s = document.createElement("style");
            s.id = "nav-anim";
            s.textContent = `
        @keyframes slideUpBounce {
          from { opacity:0; transform: translateY(60px) scale(0.9); }
          to { opacity:1; transform: translateY(0) scale(1); }
        }
      `;
            document.head.appendChild(s);
        }
    }
});