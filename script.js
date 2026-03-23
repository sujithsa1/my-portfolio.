// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Implementation
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

// Global Mouse Object
const mouse = {
    x: null,
    y: null,
    radius: 120
};

window.addEventListener('mousemove', (e) => {
    // Enable custom cursor styles only once JS is running
    if (!document.body.classList.contains('has-custom-cursor')) {
        document.body.classList.add('has-custom-cursor');
    }
    
    const posX = e.clientX;
    const posY = e.clientY;
    
    mouse.x = posX;
    mouse.y = posY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    // Smooth delay for outline
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: 'forwards' });
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Interactive hover effects for cursor
const hoverElements = document.querySelectorAll('a, button, .btn-primary, .btn-secondary, .btn-primary-sm, .glass-card');

hoverElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('cursor-hover');
    });
});

// Aurora Background Mouse Tracker
window.addEventListener('mousemove', (e) => {
    document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Background Particles (Canvas)
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class GlowingOrb {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 3 + 1; // Different sizes
        this.speedX = (Math.random() - 0.5) * 0.5; // Slow float
        this.speedY = (Math.random() - 0.5) * 0.5;
        // Electric Blue to Purple to Cyan
        const colors = ['#0070f3', '#06b6d4', '#8b5cf6'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges gently
        if (this.x < -20 || this.x > canvas.width + 20) this.speedX *= -1;
        if (this.y < -20 || this.y > canvas.height + 20) this.speedY *= -1;
        
        // Push slightly from mouse if mouse is tracked
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                this.x -= (dx / dist) * 1.5;
                this.y -= (dy / dist) * 1.5;
            }
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        // Soft glow using shadow
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for other draws
    }
}

function initOrbs() {
    particlesArray = [];
    let numberOfOrbs = (canvas.width * canvas.height) / 10000;
    for (let i = 0; i < numberOfOrbs; i++) {
        particlesArray.push(new GlowingOrb());
    }
}

function connectOrbs() {
    const maxDistance = 140;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                let opacity = 1 - (distance / maxDistance);
                ctx.strokeStyle = `rgba(0, 112, 243, ${opacity * 0.15})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateOrbs() {
    requestAnimationFrame(animateOrbs);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // cleanly clear the canvas
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connectOrbs();
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initOrbs();
});

initOrbs();
animateOrbs();

// Hero Animations on Load
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    // Smooth elastic bouncy entrance
    const bounceEase = 'elastic.out(1, 0.5)';
    
    tl.from('.navbar', { y: -50, opacity: 0, duration: 1, ease: 'power3.out' })
      .from('.hero-subtitle', { y: 30, opacity: 0, duration: 1, ease: bounceEase }, "-=0.5")
      .from('.hero-title', { y: 30, opacity: 0, duration: 1, ease: bounceEase }, "-=0.8")
      .from('.hero-role', { y: 30, opacity: 0, duration: 1, ease: bounceEase }, "-=0.8")
      .from('.hero-desc', { y: 30, opacity: 0, duration: 1, ease: bounceEase }, "-=0.8")
      .from('.hero-cta', { y: 30, opacity: 0, duration: 1, ease: bounceEase }, "-=0.8")
      .from('.scroll-indicator', { opacity: 0, duration: 1 }, "-=0.2");
});

// Unique Scroll Reveal Animations for Different Sections

// 1. About Section: Horizontal Slide & Fade
gsap.fromTo('.about-content', 
    { x: -50, opacity: 0 },
    { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '#about', start: 'top 80%', toggleActions: 'play none none none' } }
);
gsap.fromTo('.skills-container', 
    { x: 50, opacity: 0 },
    { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '#about', start: 'top 80%', toggleActions: 'play none none none' } }
);

// 2. Experience Section: 3D Fold-Up Animation
const timelineItems = document.querySelectorAll('.timeline-item');
if (timelineItems.length > 0) {
    // Animate the line drawing down
    gsap.fromTo('.timeline::before',
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: 'top', duration: 1.5, ease: 'power3.inOut', scrollTrigger: { trigger: '.timeline', start: 'top 85%', toggleActions: 'play none none none' } }
    );
    // 3D fold-up for cards
    gsap.fromTo(timelineItems, 
        { rotateX: -45, y: 50, opacity: 0, transformPerspective: 800 },
        { rotateX: 0, y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.timeline', start: 'top 85%', toggleActions: 'play none none none' } }
    );
}

// 3. Projects Section: Elastic Zoom-in
const projectCards = document.querySelectorAll('.project-card');
if (projectCards.length > 0) {
    gsap.fromTo(projectCards, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, stagger: 0.2, ease: 'elastic.out(1, 0.7)', scrollTrigger: { trigger: '#projects', start: 'top 85%', toggleActions: 'play none none none' } }
    );
}

// Education & Footer: Blur Reveal
gsap.fromTo('.edu-card, .footer', 
    { y: 30, opacity: 0, filter: 'blur(10px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: '#education', start: 'top 90%', toggleActions: 'play none none none' } }
);

// Email Reveal Logic
const revealBtn = document.getElementById('reveal-email-btn');
const emailLink = document.getElementById('email-link');

if (revealBtn && emailLink) {
    revealBtn.addEventListener('click', () => {
        revealBtn.style.display = 'none';
        emailLink.style.display = 'inline-flex';
        emailLink.href = 'mailto:sujith.venkatarao@gmail.com';
    });
}

// -----------------------------------------
// Terminal Interactive Dots
// -----------------------------------------
const terminalDots = document.querySelectorAll('.terminal-header .dot');
terminalDots.forEach(dot => {
    dot.addEventListener('click', () => {
        gsap.to('.code-terminal', {
            scale: 0.95,
            opacity: 0.8,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    });
});

// -----------------------------------------
// Terminal Typewriter Effect (Syntax Aware)
// -----------------------------------------
const codeLines = [
    { text: 'import', type: 'kw' }, { text: ' pyspark.sql.functions ', type: 'default' }, { text: 'as', type: 'kw' }, { text: ' F\n', type: 'default' },
    { text: 'from', type: 'kw' }, { text: ' infrastructure ', type: 'default' }, { text: 'import', type: 'kw' }, { text: ' Kafka, BigQuery\n\n', type: 'default' },
    { text: 'def', type: 'kw' }, { text: ' ', type: 'default' }, { text: 'run_realtime_pipeline', type: 'fn' }, { text: '():\n', type: 'default' },
    { text: '    ', type: 'default' }, { text: 'print', type: 'bi' }, { text: '(', type: 'default' }, { text: '"Initializing Streams..."', type: 'str' }, { text: ')\n', type: 'default' },
    { text: '    df = Kafka.', type: 'default' }, { text: 'readStream', type: 'fn' }, { text: '(', type: 'default' }, { text: '"telemetry"', type: 'str' }, { text: ')\n\n', type: 'default' },
    { text: '    clean_df = df.filter(F.col(', type: 'default' }, { text: '"status"', type: 'str' }, { text: ') == ', type: 'default' }, { text: '"active"', type: 'str' }, { text: ') \\\n', type: 'default' },
    { text: '                 .withColumn(', type: 'default' }, { text: '"ts"', type: 'str' }, { text: ', F.', type: 'default' }, { text: 'current_timestamp', type: 'fn' }, { text: '())\n\n', type: 'default' },
    { text: '    ', type: 'default' }, { text: '# ⚡ Real-time processing\n', type: 'cm' },
    { text: '    BigQuery.', type: 'default' }, { text: 'writeStream', type: 'fn' }, { text: '(', type: 'default' }, { text: 'clean_df, ', type: 'default' }, { text: '"prod.analytics"', type: 'str' }, { text: ')\n\n', type: 'default' },
    { text: 'run_realtime_pipeline', type: 'fn' }, { text: '()', type: 'default' }
];

const typeTarget = document.getElementById('typewriter');
if (typeTarget) {
    let segmentIndex = 0;
    let charIndex = 0;
    
    function typeWriter() {
        if (segmentIndex < codeLines.length) {
            const segment = codeLines[segmentIndex];
            const text = segment.text;
            const type = segment.type;
            
            // Create or get the span for the current segment
            let currentSpan = typeTarget.querySelector(`.segment-${segmentIndex}`);
            if (!currentSpan) {
                currentSpan = document.createElement('span');
                currentSpan.className = `segment-${segmentIndex} ${type !== 'default' ? 'syn-' + type : ''}`;
                typeTarget.appendChild(currentSpan);
            }
            
            if (charIndex < text.length) {
                const char = text.charAt(charIndex);
                currentSpan.innerHTML += char === '\n' ? '<br/>' : char;
                charIndex++;
                
                // Add energy pulse on new lines or completions
                if (char === '\n') {
                    gsap.to('.code-terminal', {
                        boxShadow: '0 0 30px var(--accent-primary-glow)',
                        duration: 0.2,
                        yoyo: true,
                        repeat: 1
                    });
                }
                
                setTimeout(typeWriter, Math.random() * 30 + 10);
            } else {
                segmentIndex++;
                charIndex = 0;
                setTimeout(typeWriter, Math.random() * 50 + 20);
            }
        }
    }
    setTimeout(typeWriter, 1500); // Wait for entrance animation
}
