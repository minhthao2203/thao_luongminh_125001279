/**
 * KICKOFF ARENA - MAIN JAVASCRIPT
 * 1. AOS (Animate On Scroll) Initialization
 * 2. Sticky Header & Active Nav on Scroll
 * 3. Mobile Navigation Menu Toggle
 * 4. Spotlight Match Live Countdown
 * 5. League Filter Tabs (Upcoming Matches)
 * 6. Interactive Prediction Voting Engine & Dynamic Percentage Bars
 * 7. Player Search & Position Filter
 * 8. Player Details Modal
 * 9. Back To Top Button
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. KHỞI TẠO AOS (ANIMATE ON SCROLL)
    // ==========================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 60
        });
    }

    // ==========================================
    // 2. STICKY HEADER & ACTIVE SCROLL STATE
    // ==========================================
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Sticky Header shadow
        if (scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        // Highlight Active Link on Scroll
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================
    // 3. MOBILE MENU TOGGLE
    // ==========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (mainNav.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Tự động đóng menu khi click vào 1 link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // ==========================================
    // 4. SPOTLIGHT MATCH LIVE COUNTDOWN
    // ==========================================
    const cdHours = document.getElementById('cdHours');
    const cdMins = document.getElementById('cdMins');
    const cdSecs = document.getElementById('cdSecs');

    if (cdHours && cdMins && cdSecs) {
        // Đặt mục tiêu trận đấu là 36 giờ 15 phút tới
        let totalSeconds = 36 * 3600 + 12 * 60 + 45;

        const updateCountdown = () => {
            if (totalSeconds <= 0) {
                totalSeconds = 86400; // Reset nếu hết giờ
            }
            totalSeconds--;

            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            cdHours.textContent = hours < 10 ? '0' + hours : hours;
            cdMins.textContent = minutes < 10 ? '0' + minutes : minutes;
            cdSecs.textContent = seconds < 10 ? '0' + seconds : seconds;
        };

        setInterval(updateCountdown, 1000);
    }

    // ==========================================
    // 5. LEAGUE FILTER TABS
    // ==========================================
    const leagueTabs = document.querySelectorAll('.league-tabs .tab-btn');
    const matchCards = document.querySelectorAll('.match-card');

    leagueTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            leagueTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const league = tab.getAttribute('data-league');

            matchCards.forEach(card => {
                if (league === 'all' || card.getAttribute('data-league') === league) {
                    card.style.display = 'flex';
                    card.classList.add('animate__animated', 'animate__fadeIn');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // 6. INTERACTIVE PREDICTION VOTING ENGINE
    // ==========================================
    // Ban đầu: Real 48%, Draw 24%, Man City 28%
    let voteCounts = {
        home: 7148,
        draw: 3574,
        away: 4170
    };
    let userHasVoted = false;

    const voteButtons = document.querySelectorAll('#votingBtns .vote-btn');
    const voteFeedback = document.getElementById('voteFeedback');
    const predRealVal = document.getElementById('predRealVal');
    const predDrawVal = document.getElementById('predDrawVal');
    const predCityVal = document.getElementById('predCityVal');
    const barHome = document.getElementById('barHome');
    const barDraw = document.getElementById('barDraw');
    const barAway = document.getElementById('barAway');

    function updatePredictionDisplay() {
        const total = voteCounts.home + voteCounts.draw + voteCounts.away;
        const homePct = Math.round((voteCounts.home / total) * 100);
        const drawPct = Math.round((voteCounts.draw / total) * 100);
        const awayPct = 100 - homePct - drawPct;

        // Cập nhật text %
        if (predRealVal) predRealVal.textContent = `${homePct}%`;
        if (predDrawVal) predDrawVal.textContent = `${drawPct}%`;
        if (predCityVal) predCityVal.textContent = `${awayPct}%`;

        // Cập nhật thanh %
        if (barHome) {
            barHome.style.width = `${homePct}%`;
            barHome.innerHTML = `<span>Real Madrid: ${homePct}%</span>`;
        }
        if (barDraw) {
            barDraw.style.width = `${drawPct}%`;
            barDraw.innerHTML = `<span>Hòa: ${drawPct}%</span>`;
        }
        if (barAway) {
            barAway.style.width = `${awayPct}%`;
            barAway.innerHTML = `<span>Man City: ${awayPct}%</span>`;
        }

        if (voteFeedback) {
            voteFeedback.textContent = `Tổng cộng ${total.toLocaleString('vi-VN')} lượt bình chọn (Tỉ lệ đã cập nhật trực tiếp)`;
            voteFeedback.style.color = 'var(--primary-color)';
        }
    }

    voteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (userHasVoted) {
                alert('Bạn đã tham gia dự đoán cho trận cầu này rồi!');
                return;
            }

            const team = btn.getAttribute('data-team');
            voteCounts[team] += 25; // Tăng thêm số vote
            userHasVoted = true;

            voteButtons.forEach(b => b.classList.remove('voted'));
            btn.classList.add('voted');

            updatePredictionDisplay();
        });
    });

    // ==========================================
    // 7. PLAYER DATA, SEARCH & POSITION FILTER
    // ==========================================
    const playersData = [
        {
            id: 1,
            name: "Vinícius Júnior",
            number: "#7",
            club: "Real Madrid",
            country: "Brazil",
            position: "FW",
            roleName: "Tiền Đạo Cánh Trái",
            age: 25,
            height: "176 cm",
            marketValue: "€180,000,000",
            image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80",
            bio: "Vinícius Júnior là một trong những tiền đạo cánh nguy hiểm và bùng nổ nhất bóng đá đương đại. Sở hữu tốc độ xé gió, kỹ năng rê bóng lắt léo và khả năng ghi bàn sắc bén trong các trận cầu lớn tại Champions League.",
            stats: {
                pace: 95,
                shooting: 89,
                passing: 84,
                dribbling: 94,
                defending: 38,
                physical: 76
            },
            seasonStats: {
                matches: 31,
                goals: 24,
                assists: 14,
                mom: 9
            }
        },
        {
            id: 2,
            name: "Erling Haaland",
            number: "#9",
            club: "Manchester City",
            country: "Na Uy",
            position: "FW",
            roleName: "Tiền Đạo Cắm",
            age: 25,
            height: "194 cm",
            marketValue: "€180,000,000",
            image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&auto=format&fit=crop&q=80",
            bio: "Cỗ máy săn bàn thượng hạng của kỷ nguyên hiện đại. Haaland là sự kết hợp hoàn hảo giữa thể hình hộ pháp, tốc độ vượt trội và bản năng sát thủ trong vòng cấm đối phương.",
            stats: {
                pace: 90,
                shooting: 97,
                passing: 72,
                dribbling: 82,
                defending: 45,
                physical: 93
            },
            seasonStats: {
                matches: 33,
                goals: 32,
                assists: 6,
                mom: 11
            }
        },
        {
            id: 3,
            name: "Jude Bellingham",
            number: "#5",
            club: "Real Madrid",
            country: "Anh",
            position: "MF",
            roleName: "Tiền Vệ Toàn Diện (Box-to-box)",
            age: 22,
            height: "186 cm",
            marketValue: "€180,000,000",
            image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
            bio: "Thủ lĩnh tuyến giữa với tư duy chơi bóng vượt tuổi đời. Bellingham công thủ toàn diện, có khả năng xâm nhập vòng cấm ghi bàn định đoạt chiến thắng ở những phút cuối cùng.",
            stats: {
                pace: 84,
                shooting: 88,
                passing: 91,
                dribbling: 89,
                defending: 82,
                physical: 86
            },
            seasonStats: {
                matches: 34,
                goals: 18,
                assists: 11,
                mom: 8
            }
        },
        {
            id: 4,
            name: "William Saliba",
            number: "#2",
            club: "Arsenal",
            country: "Pháp",
            position: "DF",
            roleName: "Trung Vệ Thép",
            age: 24,
            height: "192 cm",
            marketValue: "€85,000,000",
            image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=80",
            bio: "Hòn đá tảng vững chãi bậc nhất Ngoại Hạng Anh. Điểm mạnh của Saliba là khả năng phán đoán vị trí tĩnh, tốc độ đeo bám đối thủ và sự bình tĩnh khi triển khai bóng từ tuyến dưới.",
            stats: {
                pace: 86,
                shooting: 42,
                passing: 81,
                dribbling: 77,
                defending: 93,
                physical: 89
            },
            seasonStats: {
                matches: 35,
                goals: 2,
                assists: 1,
                cleanSheets: 18
            }
        },
        {
            id: 5,
            name: "Thibaut Courtois",
            number: "#1",
            club: "Real Madrid",
            country: "Bỉ",
            position: "GK",
            roleName: "Thủ Môn Xuất Sắc Thế Giới",
            age: 33,
            height: "200 cm",
            marketValue: "€30,000,000",
            image: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=600&auto=format&fit=crop&q=80",
            bio: "Bức tường thành kiên cố trong khung gỗ. Chiều cao lý tưởng cùng sải tay dài giúp Courtois làm chủ hoàn toàn không phận và có những pha cứu thua ngoạn mục trong các trận chung kết lớn.",
            stats: {
                pace: 52,
                shooting: 30,
                passing: 76,
                dribbling: 50,
                defending: 90,
                reflexes: 94
            },
            seasonStats: {
                matches: 28,
                cleanSheets: 15,
                savePct: "84%",
                mom: 4
            }
        },
        {
            id: 6,
            name: "Nguyễn Quang Hải",
            number: "#19",
            club: "CAHN FC",
            country: "Việt Nam",
            position: "MF",
            roleName: "Tiền Vệ Nhạc Trưởng",
            age: 28,
            height: "168 cm",
            marketValue: "€400,000",
            image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80",
            bio: "Ngôi sao hàng đầu của bóng đá Việt Nam với cái chân trái ma thuật. Nổi tiếng với những siêu phẩm đá phạt cầu vồng tuyết Thường Châu và các pha chọc khe sắc lẹm xé toang hàng thủ.",
            stats: {
                pace: 78,
                shooting: 85,
                passing: 86,
                dribbling: 84,
                defending: 52,
                vision: 88
            },
            seasonStats: {
                matches: 22,
                goals: 9,
                assists: 8,
                mom: 6
            }
        }
    ];

    // Lọc theo vị trí
    const posFilterBtns = document.querySelectorAll('.pos-filter-btn');
    const searchInput = document.getElementById('playerSearchInput');
    const playerCards = document.querySelectorAll('.player-card');

    function filterPlayers() {
        const activePosBtn = document.querySelector('.pos-filter-btn.active');
        const selectedPos = activePosBtn ? activePosBtn.getAttribute('data-pos') : 'all';
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

        playerCards.forEach(card => {
            const cardPos = card.getAttribute('data-pos');
            const cardText = card.textContent.toLowerCase();

            const matchPos = (selectedPos === 'all' || cardPos === selectedPos);
            const matchSearch = (query === '' || cardText.includes(query));

            if (matchPos && matchSearch) {
                card.style.display = 'flex';
                card.classList.add('animate__animated', 'animate__fadeIn');
            } else {
                card.style.display = 'none';
            }
        });
    }

    posFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            posFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterPlayers();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterPlayers);
    }

    // ==========================================
    // 8. PLAYER DETAILS MODAL
    // ==========================================
    const playerModal = document.getElementById('playerModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalContent = document.getElementById('modalContent');

    function openPlayerModal(playerId) {
        const player = playersData.find(p => p.id === parseInt(playerId, 10));
        if (!player) return;

        modalContent.innerHTML = `
            <div class="modal-player-header">
                <div class="modal-player-avatar">
                    <img src="${player.image}" alt="${player.name}">
                </div>
                <div class="modal-player-title">
                    <span class="sub-badge">${player.position} • ${player.number}</span>
                    <h2>${player.name}</h2>
                    <p class="modal-player-club"><i class="fa-solid fa-shield-halved"></i> ${player.club} | <i class="fa-solid fa-flag"></i> ${player.country}</p>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Tuổi: ${player.age} • Chiều cao: ${player.height} • Định giá: <strong style="color: var(--accent-gold);">${player.marketValue}</strong></p>
                </div>
            </div>

            <div style="margin-bottom: var(--space-xl);">
                <h4 style="font-size: 1.1rem; margin-bottom: 0.4rem; color: var(--text-primary);"><i class="fa-solid fa-circle-info"></i> Tiểu Sử & Phong Cách Chơi</h4>
                <p style="font-size: 0.95rem; line-height: 1.7; color: var(--text-secondary);">${player.bio}</p>
            </div>

            <div style="margin-bottom: var(--space-xl);">
                <h4 style="font-size: 1.1rem; margin-bottom: var(--space-md); color: var(--text-primary);"><i class="fa-solid fa-chart-column"></i> Bộ Chỉ Số Kỹ Thuật (EA Sports / Opta Data)</h4>
                <div class="modal-stats-grid">
                    <div class="modal-stat-bar">
                        <div class="modal-stat-bar-header">
                            <span>Tốc Độ (Pace)</span>
                            <span style="color: var(--primary-color);">${player.stats.pace} / 99</span>
                        </div>
                        <div class="modal-stat-track"><div class="modal-stat-fill" style="width: ${player.stats.pace}%;"></div></div>
                    </div>
                    <div class="modal-stat-bar">
                        <div class="modal-stat-bar-header">
                            <span>Dứt Điểm (Shooting)</span>
                            <span style="color: var(--primary-color);">${player.stats.shooting} / 99</span>
                        </div>
                        <div class="modal-stat-track"><div class="modal-stat-fill" style="width: ${player.stats.shooting}%;"></div></div>
                    </div>
                    <div class="modal-stat-bar">
                        <div class="modal-stat-bar-header">
                            <span>Chuyền Bóng (Passing)</span>
                            <span style="color: var(--primary-color);">${player.stats.passing} / 99</span>
                        </div>
                        <div class="modal-stat-track"><div class="modal-stat-fill" style="width: ${player.stats.passing}%;"></div></div>
                    </div>
                    <div class="modal-stat-bar">
                        <div class="modal-stat-bar-header">
                            <span>Rê Bóng (Dribbling)</span>
                            <span style="color: var(--primary-color);">${player.stats.dribbling} / 99</span>
                        </div>
                        <div class="modal-stat-track"><div class="modal-stat-fill" style="width: ${player.stats.dribbling}%;"></div></div>
                    </div>
                    <div class="modal-stat-bar">
                        <div class="modal-stat-bar-header">
                            <span>Phòng Ngự (Defending)</span>
                            <span style="color: var(--primary-color);">${player.stats.defending} / 99</span>
                        </div>
                        <div class="modal-stat-track"><div class="modal-stat-fill" style="width: ${player.stats.defending}%;"></div></div>
                    </div>
                    <div class="modal-stat-bar">
                        <div class="modal-stat-bar-header">
                            <span>Thể Lực / Sức Mạnh</span>
                            <span style="color: var(--primary-color);">${player.stats.physical || player.stats.reflexes || 85} / 99</span>
                        </div>
                        <div class="modal-stat-track"><div class="modal-stat-fill" style="width: ${player.stats.physical || player.stats.reflexes || 85}%;"></div></div>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: var(--space-md); justify-content: flex-end;">
                <button class="btn btn-glass" onclick="document.getElementById('playerModal').classList.remove('active')">Đóng</button>
                <a href="#predictions" class="btn btn-primary" onclick="document.getElementById('playerModal').classList.remove('active')">Xem Trận Đấu Của Cầu Thủ Này</a>
            </div>
        `;

        playerModal.classList.add('active');
        playerModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Ngăn cuộn trang khi modal mở
    }

    function closePlayerModal() {
        playerModal.classList.remove('active');
        playerModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Gắn sự kiện cho các nút mở modal
    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const playerId = e.currentTarget.getAttribute('data-player-id');
            openPlayerModal(playerId);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePlayerModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closePlayerModal);

    // Đóng bằng phím Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && playerModal.classList.contains('active')) {
            closePlayerModal();
        }
    });


    // ==========================================
    // 10. BẢNG MÀU ĐỔI MÀU GIAO DIỆN (THEME COLOR SWITCHER)
    // ==========================================
    const paletteToggle = document.getElementById('paletteToggle');
    const floatingThemeBtn = document.getElementById('floatingThemeBtn');
    const themePanelWrapper = document.getElementById('themePanelWrapper');
    const themeBackdrop = document.getElementById('themeBackdrop');
    const themeCloseBtn = document.getElementById('themeCloseBtn');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const customColorInput = document.getElementById('customColorInput');
    const customHexDisplay = document.getElementById('customHexDisplay');
    const currentThemeName = document.getElementById('currentThemeName');
    const btnDarkMode = document.getElementById('btnDarkMode');
    const btnLightMode = document.getElementById('btnLightMode');
    const resetThemeBtn = document.getElementById('resetThemeBtn');

    // Chuyển HEX sang RGBA để tạo hiệu ứng phát sáng neon mượt mà
    function hexToRgba(hex, alpha) {
        let cleanHex = hex.replace('#', '');
        if (cleanHex.length === 3) {
            cleanHex = cleanHex.split('').map(c => c + c).join('');
        }
        const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
        const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
        const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Làm tối màu một chút để làm màu :hover
    function adjustShade(hex, percent) {
        let cleanHex = hex.replace('#', '');
        if (cleanHex.length === 3) {
            cleanHex = cleanHex.split('').map(c => c + c).join('');
        }
        let num = parseInt(cleanHex, 16);
        let amt = Math.round(2.55 * percent);
        let R = (num >> 16) + amt;
        let G = (num >> 8 & 0x00FF) + amt;
        let B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 0 ? 0 : B) : 255)).toString(16).slice(1);
    }

    // Áp dụng màu cho toàn trang
    function applyThemeColor(primaryColor, hoverColor, themeName, themeLabel) {
        const root = document.documentElement;

        // Cập nhật CSS Variables trên :root
        root.style.setProperty('--primary-color', primaryColor);
        root.style.setProperty('--primary-hover', hoverColor || adjustShade(primaryColor, -12));
        root.style.setProperty('--primary-glow', hexToRgba(primaryColor, 0.4));
        root.style.setProperty('--border-accent', hexToRgba(primaryColor, 0.5));

        // Cập nhật attribute data-theme
        root.setAttribute('data-theme', themeName);

        // Cập nhật hiển thị mã màu & tên theme
        if (customHexDisplay) customHexDisplay.textContent = primaryColor.toUpperCase();
        if (customColorInput) customColorInput.value = primaryColor;
        if (currentThemeName) currentThemeName.textContent = themeLabel || themeName;

        // Lưu lựa chọn vào LocalStorage
        try {
            localStorage.setItem('kickoff_theme_name', themeName);
            localStorage.setItem('kickoff_primary_color', primaryColor);
            localStorage.setItem('kickoff_hover_color', hoverColor || adjustShade(primaryColor, -12));
            localStorage.setItem('kickoff_theme_label', themeLabel || themeName);
        } catch (e) {
            console.warn('LocalStorage không khả dụng');
        }
    }

    // Chuyển đổi Dark / Light Mode
    function applyDisplayMode(mode) {
        document.documentElement.setAttribute('data-mode', mode);
        if (btnDarkMode && btnLightMode) {
            if (mode === 'light') {
                btnLightMode.classList.add('active');
                btnDarkMode.classList.remove('active');
            } else {
                btnDarkMode.classList.add('active');
                btnLightMode.classList.remove('active');
            }
        }
        try {
            localStorage.setItem('kickoff_mode', mode);
        } catch (e) {}
    }

    // Đóng / Mở Panel bảng màu
    function openThemePanel() {
        if (themePanelWrapper) {
            themePanelWrapper.classList.add('open');
            themePanelWrapper.setAttribute('aria-hidden', 'false');
        }
    }

    function closeThemePanel() {
        if (themePanelWrapper) {
            themePanelWrapper.classList.remove('open');
            themePanelWrapper.setAttribute('aria-hidden', 'true');
        }
    }

    if (paletteToggle) paletteToggle.addEventListener('click', openThemePanel);
    if (floatingThemeBtn) floatingThemeBtn.addEventListener('click', openThemePanel);
    if (themeCloseBtn) themeCloseBtn.addEventListener('click', closeThemePanel);
    if (themeBackdrop) themeBackdrop.addEventListener('click', closeThemePanel);

    // Gắn sự kiện click cho các ô màu mẫu có sẵn (Presets)
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');

            const theme = swatch.getAttribute('data-theme');
            const color = swatch.getAttribute('data-color');
            const hover = swatch.getAttribute('data-hover');
            const name = swatch.getAttribute('data-name');

            applyThemeColor(color, hover, theme, name);
        });
    });

    // Tự chọn màu tùy chỉnh với ô chọn màu (Color Picker Input)
    if (customColorInput) {
        customColorInput.addEventListener('input', (e) => {
            const pickedColor = e.target.value;
            colorSwatches.forEach(s => s.classList.remove('active'));
            applyThemeColor(pickedColor, adjustShade(pickedColor, -12), 'custom', `Màu Tùy Chỉnh (${pickedColor.toUpperCase()})`);
        });
    }

    // Đổi Chế độ Sáng / Tối
    if (btnDarkMode) {
        btnDarkMode.addEventListener('click', () => applyDisplayMode('dark'));
    }
    if (btnLightMode) {
        btnLightMode.addEventListener('click', () => applyDisplayMode('light'));
    }

    // Khôi phục mặc định
    if (resetThemeBtn) {
        resetThemeBtn.addEventListener('click', () => {
            colorSwatches.forEach(s => {
                s.classList.toggle('active', s.getAttribute('data-theme') === 'green');
            });
            applyThemeColor('#00f59b', '#00d685', 'green', 'Xanh Sân Cỏ (Neon Pitch)');
            applyDisplayMode('dark');
            try {
                localStorage.removeItem('kickoff_theme_name');
                localStorage.removeItem('kickoff_primary_color');
                localStorage.removeItem('kickoff_hover_color');
                localStorage.removeItem('kickoff_theme_label');
                localStorage.removeItem('kickoff_mode');
            } catch (e) {}
        });
    }

    // Khởi tạo theme đã lưu từ LocalStorage khi tải trang
    (function initSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('kickoff_theme_name');
            const savedColor = localStorage.getItem('kickoff_primary_color');
            const savedHover = localStorage.getItem('kickoff_hover_color');
            const savedLabel = localStorage.getItem('kickoff_theme_label');
            const savedMode = localStorage.getItem('kickoff_mode');

            if (savedColor) {
                applyThemeColor(savedColor, savedHover, savedTheme || 'custom', savedLabel);
                colorSwatches.forEach(swatch => {
                    swatch.classList.toggle('active', swatch.getAttribute('data-theme') === savedTheme);
                });
            }

            if (savedMode) {
                applyDisplayMode(savedMode);
            }
        } catch (e) {
            console.warn('Không thể đọc theme từ LocalStorage', e);
        }
    })();

});
