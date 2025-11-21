// ==================== GSAP 플러그인 ====================
gsap.registerPlugin(ScrollTrigger);

// ==================== Lenis ====================
const lenis = new Lenis({
  duration: 0.8,
  easing: (t) => t, // 선형 (빠른 반응)
  smooth: true,
  smoothTouch: true, // 모바일 터치 스크롤 부드럽게
});

function raf(t) {
  lenis.raf(t);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ==================== Header show/hide ====================
const site_header = document.getElementById("site_header");
let lastY = 0;
lenis.on("scroll", ({ scroll }) => {
  const y = scroll;
  if (y > lastY + 4 && y > 120) site_header.style.transform = "translateY(-100%)";
  else if (y < lastY - 4) site_header.style.transform = "translateY(0)";
  lastY = y;
});

// ==================== Horizontal gallery helper ====================
const total_width = () => {
  const wrap = document.querySelector(".horizontal_section");
  const track = document.querySelector(".track");
  return track.scrollWidth - wrap.clientWidth;
};

// ==================== Navigation Active ====================
const ham = document.querySelector('.menu_toggle');
const mpanel = document.querySelector('.mobile_panel');
ham.addEventListener('click', () => {
  document.querySelector('.mobile_panel').classList.toggle('block');
})

const navLinks = document.querySelectorAll(".primary_nav a, .mobile_menu a");

function set_active(link) {
  // 1️⃣ .primary_nav 내의 링크들만 초기화
  const primaryLinks = document.querySelectorAll(".primary_nav a");
  primaryLinks.forEach((a) => a.classList.remove("is_active"));

  // 2️⃣ 클릭된 링크와 동일한 href를 가진 .primary_nav 링크만 활성화
  const href = link.getAttribute("href");
  const match = document.querySelector(`.primary_nav a[href="${href}"]`);
  if (match) match.classList.add("is_active");
}


// 섹션 맵 정의
const sub_map = [
  "#hero",
  "#about",
  "#skill",
  "#showcase",
  "#gallery",
  "#stats",
  "#contact"
];

sub_map.forEach((id) => {
  const section = document.querySelector(id);
  const linkEl = document.querySelectorAll(
    `.primary_nav a[href="${id}"], .mobile_menu a[href="${id}"]`
  );
  if (!section || !linkEl.length) return;

  if (id === "#Skill") {
    // Showcase → pin_scene ScrollTrigger와 동일
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=1800",
      onEnter: () => linkEl.forEach((a) => set_active(a)),
      onEnterBack: () => linkEl.forEach((a) => set_active(a)),
    });
  } else if (id === "#showcase") {
    // Gallery → horizontal_section ScrollTrigger와 동일
    ScrollTrigger.create({
      trigger: ".info_section .wrapper",
      start: "top top+=100",   // 살짝 늦게 시작
      end: "bottom bottom-=100", // projects 끝날 때 해제
      pin: ".info_section .info",
      pinSpacing: true, // 고정 중 여백 추가 안함
      anticipatePin: 1,
      scrub: true,
      onEnter: () => linkEl.forEach((a) => set_active(a)),
      onEnterBack: () => linkEl.forEach((a) => set_active(a)),
    });
  } else if (id === "#gallery") {
    // Gallery → horizontal_section ScrollTrigger와 동일
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => "+=" + (total_width() + window.innerWidth),
      onEnter: () => linkEl.forEach((a) => set_active(a)),
      onEnterBack: () => linkEl.forEach((a) => set_active(a)),
    });
  } else {
    // 일반 섹션
    ScrollTrigger.create({
      trigger: section,
      start: "top top+=100",
      end: "bottom top+=100",
      onEnter: () => linkEl.forEach((a) => set_active(a)),
      onEnterBack: () => linkEl.forEach((a) => set_active(a)),
    });
  }
});

// ==================== 네비 클릭 Lenis.scrollTo ====================
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetEl = document.querySelector(targetId);
    mpanel.classList.remove('block');
    // 메뉴 닫히는 transition 끝난 후 스크롤 실행

    if (targetEl) {
      lenis.scrollTo(targetEl, { offset: -80 });
    }
    set_active(link);
  });
});

// ==================== Hero intro ====================
gsap.timeline({ defaults: { duration: 0.8, ease: "power2.out" } })
  .to(".hero_title", { y: 0, opacity: 1 })
  .to(".hero_sub", { y: 0, opacity: 1 }, "<0.12")
  .to(".hero_cta", { y: 0, opacity: 1 }, "<0.12");

// ==================== Marquee ====================
(function () {
  document.querySelectorAll(".marquee_wrap").forEach((wrap) => {
    const row = wrap.querySelector(".marquee_row");
    const rowWidth = row.scrollWidth;

    // 최소 2세트 이상 복제
    for (let i = 1; i < 10; i++) {
      wrap.appendChild(row.cloneNode(true));
    }

    const rows = wrap.querySelectorAll(".marquee_row");
    let x = 0;

    function step() {
      const dir = wrap.classList.contains("reverse") ? 1 : -1; // 방향
      x += dir; // 이동

      rows.forEach((r, i) => {
        let offset = x + i * rowWidth;

        if (dir === -1) {
          // ← 왼쪽 이동
          if (offset <= -rowWidth) offset += rowWidth * rows.length;
        } else {
          // → 오른쪽 이동
          if (offset >= rowWidth * (rows.length - 1)) offset -= rowWidth * rows.length;
        }

        r.style.transform = `translateX(${offset}px)`;
      });

      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
})();



gsap.from(".info_section .card", {
  y: 40,
  opacity: 0,
  duration: 0.6,
  ease: "power2.out",
  stagger: 0.25,
  scrollTrigger: {
    trigger: ".info_section .projects",
    start: "top 80%",
  },
});


// ==================== Features reveal ====================
gsap.to(".feature_card", {
  y: 0,
  opacity: 1,
  duration: 0.6,
  ease: "power2.out",
  stagger: 0.22,
  scrollTrigger: {
    trigger: ".features_grid",
    start: "top 50%",
    toggleActions: "play reverse play reverse",
  },
});

// 단어별 split
document.querySelectorAll(".feature_card h3 strong").forEach((h) => {
  const words = h.textContent.split(" ");
  h.innerHTML = words.map((w) => `<span class="word">${w}</span>`).join(" ");
});
gsap.from(".feature_card .word", {
  y: 20,
  opacity: 0,
  duration: 0.5,
  ease: "power2.out",
  stagger: 0.03,
  scrollTrigger: {
    trigger: ".features_grid",
    start: "top 50%",
    toggleActions: "play reverse play reverse",
  },
});


// ==================== Feature Card Glass Hover ====================
document.querySelectorAll(".feature_card").forEach((card) => {
  // 💡 카드 안에 반사 효과용 요소 추가
  const glass = document.createElement("div");
  glass.className = "glass_reflect";
  card.appendChild(glass);

  // 💡 마우스 움직임 이벤트
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 반사광 위치 계산
    glass.style.background = `
      radial-gradient(
        circle at ${x}px ${y}px,
        rgba(230, 225, 167, 0.2),
        rgba(171, 172, 83, 0) 30%
      )
    `;
  });

  // 💡 마우스 나갈 때 부드럽게 사라지기
  card.addEventListener("mouseleave", () => {
    glass.style.background = "transparent";
  });
});

// ==================== Info Section Sticky Background Swap ====================
const stickyBox = document.querySelector(".sticky_box");
const cards = gsap.utils.toArray(".info_section .card");

// info1.png, info2.png, info3.png 순서로 자동 매핑
cards.forEach((card, i) => {
  const imgUrl = `./asset/info${i + 1}.png`;

  ScrollTrigger.create({
    trigger: card,
    start: "top center",
    end: "bottom center",
    // ✅ 카드 안에 있을 때만 해당 이미지로 유지
    onEnter: () => changeBg(imgUrl),
    onEnterBack: () => changeBg(imgUrl),
    onLeave: () => holdPrevious(i),
    onLeaveBack: () => holdPrevious(i),
  });
});

// 이미지 전환 함수 (페이드 포함)
function changeBg(imgUrl) {
  gsap.to(stickyBox, {
    // opacity: 0,
    duration: 0.3,
    onComplete: () => {
      stickyBox.style.backgroundImage = `url(${imgUrl})`;
      gsap.to(stickyBox, { opacity: 1, duration: 0.6 });
    },
  });
}

// gap 구간에서는 이전 이미지 유지
function holdPrevious(index) {
  // 첫 카드 전이면 info1 유지
  const prevIndex = Math.max(0, Math.min(cards.length - 1, index));
  const prevImgUrl = `./asset/info${prevIndex + 1}.png`;
  stickyBox.style.backgroundImage = `url(${prevImgUrl})`;
}




// ==================== Card tilt ====================
document.querySelectorAll(".tilt_card").forEach((card) => {
  const layer = card.querySelector(".tilt_layer");
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -5;
    const ry = (px - 0.5) * 22;
    layer.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  });
  card.addEventListener("mouseleave", () => {
    layer.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
});

// ==================== Showcase stack ====================
const pin_bg = document.getElementById("pin_bg");
const photos = gsap.utils.toArray(".photo");

const pinTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".pin_scene",
    start: "top top",
    end: "+=1800",
    pin: true,
    scrub: true,
    anticipatePin: 1,
    toggleActions: "play none none reset",
  },
});

pinTl.to(pin_bg, { filter: "blur(12px)", scale: 1.06, duration: 1, ease: "none" }, 0);
photos.forEach((el, i) => {
  pinTl.add(() => {
    el.style.zIndex = String(100 + i);
    el.classList.add("glitch");
    gsap.delayedCall(0.4, () => el.classList.remove("glitch"));
  }, i * 0.22);
  pinTl.fromTo(
    el,
    { opacity: 0, y: 1080, scale: 0.4, filter: "blur(6px)", rotate: i % 2 ? 4 : -4 },
    { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", rotate: i % 2 ? 5 : -5, duration: 0.85, ease: "power3.out" },
    i * 0.22
  );
});
pinTl.to(".float_wrap", { yPercent: -6, duration: 0.8, ease: "none" }, ">0.1");

// ==================== Horizontal gallery ====================
gsap.to(".track", {
  x: () => -total_width(),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal_section",
    start: "top top",
    end: () => "+=" + (total_width() + window.innerWidth),
    scrub: true,
    pin: true,
    anticipatePin: 1,
    toggleActions: "play none none reset",
  },
});
window.addEventListener("resize", () => ScrollTrigger.refresh());

// ==================== Stats counters ====================
document.querySelectorAll("[data-count-to]").forEach((el) => {
  const end = parseInt(el.getAttribute("data-count-to"), 10);
  const obj = { val: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: "top 55%",
    onEnter() {
      gsap.to(obj, {
        val: end,
        duration: 1.2,
        ease: "power2.out",
        onUpdate() {
          el.textContent = Math.floor(obj.val);
        },
      });
    },
    onLeaveBack() {
      el.textContent = 0;
    },
  });
});

// ==================== CTA reveal + Magnetic ====================
gsap.to(".cta_btn", {
  y: 0,
  opacity: 1,
  duration: 0.6,
  ease: "power2.out",
  scrollTrigger: { trigger: ".cta_section", start: "top 80%", toggleActions: "play none none reset" },
});

document.querySelectorAll(".magnet_zone").forEach((zone) => {
  const btn = zone.querySelector(".cta_btn");
  zone.style.position = "relative";
  zone.style.display = "inline-block";
  zone.addEventListener("mousemove", (e) => {
    const r = zone.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  });
  zone.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0,0)";
  });
});

// ==================== Refresh ====================
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
  setTimeout(() => ScrollTrigger.refresh(), 500); // ✅ Lenis 초기화 후 0.5초 뒤 다시
});
