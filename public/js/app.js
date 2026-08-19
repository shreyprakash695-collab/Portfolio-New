document.addEventListener('DOMContentLoaded', function() {
  initNav();
  initHeroGraphParallax();
  initIntersectionObserver();
  initProjectFiltering();
  initContactForm();
});

// Sticky Navigation and ScrollSpy
function initNav() {
  var nav = document.querySelector('nav');
  var toggle = function() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });

  var links = document.querySelectorAll('.nav-links a');
  var sections = Array.prototype.map.call(links, function(a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        var i = sections.indexOf(entry.target);
        if (i === -1) return;
        if (entry.isIntersecting) {
          links[i].classList.add('active');
        } else {
          links[i].classList.remove('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(function(s) { spy.observe(s); });
  }
}

// Hero SVG graph interactive mouse parallax
function initHeroGraphParallax() {
  var svg = document.querySelector('.hero-graph svg');
  var header = document.querySelector('header.hero');
  if (!svg || !header) return;

  header.addEventListener('mousemove', function(e) {
    var rect = header.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width - 0.5;
    var y = (e.clientY - rect.top) / rect.height - 0.5;
    svg.style.transform = 'translate(' + (x * -14) + 'px,' + (y * -14) + 'px)';
  });
  header.addEventListener('mouseleave', function() {
    svg.style.transform = 'translate(0, 0)';
  });
}

// Reveal animations on scroll
function initIntersectionObserver() {
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function(el) { el.classList.add('in-view'); });
    return;
  }
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  items.forEach(function(el) { observer.observe(el); });
}

// Project Tag Filtering
function initProjectFiltering() {
  var filterButtons = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterButtons.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = (btn.getAttribute('data-filter') || 'all').toLowerCase();

      projectCards.forEach(function(card) {
        var tags = (card.getAttribute('data-tags') || '').toLowerCase().split(',');
        if (filter === 'all' || tags.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Contact Form Handler
function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var name = (form.name.value || '').trim();
    var email = (form.email.value || '').trim();
    var subject = (form.subject.value || 'Portfolio Contact').trim();
    var message = (form.message.value || '').trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    var origText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';

    setTimeout(function() {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origText;
      showToast('Thank you ' + name + '! Your message has been prepared for Shrey Prakash.', 'success');
      
      // Also construct direct mailto link
      var mailtoLink = 'mailto:shreyprakash695@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message);
      window.location.href = mailtoLink;
      
      form.reset();
    }, 600);
  });
}

// Toast Notification
function showToast(message, type) {
  type = type || 'success';
  var container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = '<span>' + escapeHtml(message) + '</span>';

  container.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(function() { toast.remove(); }, 300);
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
