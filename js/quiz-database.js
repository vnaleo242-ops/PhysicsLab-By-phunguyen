/**
 * PHYSICS LAB - HỆ THỐNG NGÂN HÀNG CÂU HỎI PARAMETERIZED
 * Database này chứa các Hạt Giống (Seeds) thuật toán sinh đề động.
 */

(function initQuizDatabase() {
    // Utility functions for parameterized generation
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randomFloat = (min, max, decimals = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
    const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const roundTo = (num, decimals) => Number(Math.round(num + "e" + decimals) + "e-" + decimals);

    // Shuffle array function for answers
    const shuffleArray = (array) => {
        const arr = [...array];
        let correctIndex = 0;
        let originalCorrectItem = arr[0]; // Assuming 0 is initially correct

        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        correctIndex = arr.indexOf(originalCorrectItem);
        return { shuffled: arr, correctIndex };
    };

    const seeds = {
        'dao-dong': {
            mcq: [
                // Hạt giống MCQ: Tính tốc độ dựa trên phương trình x
                () => {
                    const A = randomInt(4, 10);
                    const omega_coeff = randomChoice([2, 4, 10, 20]);
                    const omega = omega_coeff * Math.PI;
                    const phi = randomChoice(['\\frac{\\pi}{3}', '\\frac{\\pi}{2}', '\\frac{\\pi}{6}', '0']);
                    const x = randomInt(2, A - 1);

                    // v = omega * sqrt(A^2 - x^2)
                    const v_val = roundTo(omega_coeff * Math.sqrt(A * A - x * x), 1);
                    const v_ans = `${v_val}\\pi \\text{ cm/s}`;

                    // Nắm bắt bẫy sai lầm
                    const trap1 = `-${v_val}\\pi \\text{ cm/s}`; // Nhầm vận tốc độ vs tốc độ
                    const trap2 = `${roundTo(omega_coeff * A, 1)}\\pi \\text{ cm/s}`; // Nhầm v_max
                    const trap3 = `${v_val} \\text{ cm/s}`; // Thiếu PI

                    const opts = shuffleArray([v_ans, trap1, trap2, trap3]);

                    return {
                        type: 'mcq',
                        question: `Một vật dao động điều hòa với phương trình \\( x = ${A}\\cos(${omega_coeff}\\pi t + ${phi}) \\text{ (cm)} \\). Xét tốc độ của vật khi nó đi qua vị trí có li độ \\( x = ${x} \\text{ cm} \\). (Cho \\( \\pi^2 \\approx 10 \\)). Giá trị tốc độ đó là:`,
                        options: opts.shuffled.map(o => `\\( ${o} \\)`),
                        correctAnswer: opts.correctIndex,
                        explanation: `Theo hệ thức độc lập, tốc độ \\( v = \\omega \\sqrt{A^2 - x^2} \\). Thay số: \\( v = ${omega_coeff}\\pi \\sqrt{${A}^2 - ${x}^2} = ${v_val}\\pi \\text{ (cm/s)} \\). Chú ý: Hỏi "tốc độ" (độ lớn của vận tốc) nên giá trị phải dương.`
                    };
                },
                // Hạt giống MCQ: Lực đàn hồi con lắc lò xo treo thẳng đứng
                () => {
                    const k = randomChoice([40, 50, 100]);
                    const m_gram = randomChoice([100, 200, 400]);
                    const m = m_gram / 1000;
                    const g = 10;
                    
                    const deltaL0 = (m * g) / k; // in meters
                    const deltaL0_cm = deltaL0 * 100;
                    // Đàm bảo A > deltaL0 để bẫy vị trí tự nhiên
                    const A_cm = deltaL0_cm + randomInt(2, 5); 
                    const A = A_cm / 100;
                    
                    const F_max = k * (deltaL0 + A);
                    const F_min = 0; // Vì A > deltaL0

                    const trap_F_min = roundTo(k * (A - deltaL0), 1); // Sai lầm kinh điển

                    const ans = `F_{max} = ${roundTo(F_max, 1)} \\text{ N}, F_{min} = 0 \\text{ N}`;
                    const trap1 = `F_{max} = ${roundTo(F_max, 1)} \\text{ N}, F_{min} = ${trap_F_min} \\text{ N}`;
                    const trap2 = `F_{max} = ${roundTo(k * A, 1)} \\text{ N}, F_{min} = 0 \\text{ N}`; // Nhầm nằm ngang
                    const trap3 = `F_{max} = ${roundTo(k * A, 1)} \\text{ N}, F_{min} = ${trap_F_min} \\text{ N}`;

                    const opts = shuffleArray([ans, trap1, trap2, trap3]);

                    return {
                        type: 'mcq',
                        question: `Một con lắc lò xo treo thẳng đứng, độ cứng \\( k = ${k}\\text{ N/m} \\), khối lượng vật nhỏ \\( m = ${m_gram}\\text{ g} \\). Kích thích để vật dao động với biên độ \\( A = ${A_cm}\\text{ cm} \\). Lấy \\( g = ${g}\\text{ m/s}^2 \\). Lực đàn hồi cực đại và cực tiểu tác dụng vào vật trong quá trình dao động là:`,
                        options: opts.shuffled.map(o => `\\( ${o} \\)`),
                        correctAnswer: opts.correctIndex,
                        explanation: `Độ biến dạng tại VTCB: \\( \\Delta l_0 = \\frac{mg}{k} = \\frac{${m} \\times ${g}}{${k}} = ${deltaL0} \\text{ m} = ${deltaL0_cm} \\text{ cm} \\).<br/> Lực đàn hồi cực đại: \\( F_{max} = k(\\Delta l_0 + A) = ${k}(${deltaL0} + ${A}) = ${roundTo(F_max, 1)}\\text{ N} \\).<br/> Vì \\( A = ${A_cm}\\text{ cm} > \\Delta l_0 \\), vật đi qua vị trí lò xo không biến dạng, do đó \\( F_{min} = 0\\text{ N} \\).`
                    };
                }
            ],
            tf: [
                // Hạt giống True-False: Con lắc đơn
                () => {
                    const l = randomChoice([0.8, 1.0, 1.2]);
                    const g = randomChoice([9.8, 10]);
                    return {
                        type: 'tf_cluster',
                        context: `Một con lắc đơn có chiều dài \\( l = ${l} \\text{ m} \\) dao động điều hòa tại nơi có gia tốc trọng trường \\( g = ${g} \\text{ m/s}^2 \\) với biên độ góc rất nhỏ (\\( \\alpha_0 \\ll 1 \\text{ rad} \\)).`,
                        statements: [
                            { 
                                text: "Chu kì dao động của con lắc phụ thuộc vào khối lượng của quả nặng.", 
                                isTrue: false, 
                                explanation: "Chu kì \\( T = 2\\pi\\sqrt{\\frac{l}{g}} \\), hoàn toàn độc lập với khối lượng quả nặng." 
                            },
                            { 
                                text: "Lực căng dây của con lắc đạt giá trị cực đại khi vật đi qua vị trí cân bằng và có độ lớn chính bằng trọng lượng của vật ở vị trí đó.", 
                                isTrue: false, 
                                explanation: "Sai ở vế sau. Tại VTCB, lực căng \\( T_{max} = mg(3 - 2\\cos\\alpha_0) > mg \\). Không thể đơn thuần cân bằng tĩnh với trọng lượng do ở VTCB hệ chịu độ võng hướng tâm lớn nhất." 
                            },
                            { 
                                text: "Khi dao động đi từ vị trí biên về vị trí cân bằng, thế năng của con lắc chuyển hóa dần thành động năng.", 
                                isTrue: true, 
                                explanation: "Đúng theo định luật bảo toàn cơ năng, độ cao giảm dần làm thế năng giảm, chuyển thành động năng." 
                            },
                            { 
                                text: "Gia tốc của vật bằng \\( 0 \\) khi vật đi qua vị trí cân bằng.", 
                                isTrue: false, 
                                explanation: "Tại VTCB, thành phần tiếp tuyến của gia tốc bằng 0, nhưng vận tốc đạt max nên gia tốc hướng tâm \\( a_n = \\frac{v_{max}^2}{l} \\neq 0 \\) lớn nhất. Gia tốc toàn phần khác 0." 
                            }
                        ]
                    };
                }
            ],
            sa: [
                // Hạt giống Short Answer: Truyền năng lượng (Va chạm mềm)
                () => {
                    const k = randomChoice([50, 100, 200]);
                    const m1_gram = randomInt(20, 30) * 10; // 200 - 300g
                    const m2_gram = randomChoice([20, 50, 100]);
                    const v0 = randomFloat(0.5, 2.0, 2); // 0.5 - 2.0 m/s
                    
                    const m1 = m1_gram / 1000;
                    const m2 = m2_gram / 1000;
                    
                    // V = m2*v0 / (m1+m2)
                    const V = (m2 * v0) / (m1 + m2);
                    // omega = sqrt(k / (m1+m2))
                    const omega = Math.sqrt(k / (m1 + m2));
                    // A = V / omega
                    const A_meters = V / omega;
                    const A_cm = A_meters * 100;

                    const final_ans = roundTo(A_cm, 1);

                    return {
                        type: 'sa',
                        question: `Một con lắc lò xo đặt trên mặt phẳng ngang không ma sát, lò xo có độ cứng \\( k = ${k}\\text{ N/m} \\), vật nặng \\( m_1 = ${m1_gram}\\text{ g} \\). Mới đầu hệ ở VTCB. Một viên đạn khối lượng \\( m_2 = ${m2_gram}\\text{ g} \\) bay thẳng với vận tốc \\( v_0 = ${v0}\\text{ m/s} \\) dọc trục đến va chạm mềm xuyên tâm vào khối \\( m_1 \\). Tính biên độ dao động của hệ sau va chạm (tính bằng cm, làm tròn 1 chữ số thập phân).`,
                        correctAnswer: final_ans,
                        suffix: "cm",
                        explanation: `Theo định luật bảo toàn động lượng do thời gian va chạm cực ngắn: \\( V = \\frac{m_2 v_0}{m_1 + m_2} = \\frac{${m2} \\times ${v0}}{${m1} + ${m2}} = ${roundTo(V, 3)}\\text{ m/s} \\).<br/>Tần số góc mới: \\( \\omega = \\sqrt{\\frac{k}{m_1 + m_2}} = \\sqrt{\\frac{${k}}{${m1 + m2}}} = ${roundTo(omega, 2)}\\text{ rad/s} \\).<br/>Phần động năng ngay sau va chạm chuyền hoàn toàn cho hệ làm cơ năng dao động (biên độ A), có \\( A = \\frac{V}{\\omega} = ${roundTo(A_meters, 4)}\\text{ m} = ${final_ans} \\text{ cm} \\).`
                    };
                }
            ]
        },
        'song': {
            mcq: [
                // Tốc độ truyền pha từ phương trình
                () => {
                    const amp = randomInt(2, 6);
                    const f = randomInt(5, 50);
                    const freq_lambda_ratio = randomChoice(['\\pi', '2\\pi', '0.5\\pi']); // => \omega t - a x
                    let coeff_x = 0;
                    if(freq_lambda_ratio === '\\pi') coeff_x = Math.PI;
                    if(freq_lambda_ratio === '2\\pi') coeff_x = 2 * Math.PI;
                    if(freq_lambda_ratio === '0.5\\pi') coeff_x = 0.5 * Math.PI;

                    // 2PI / lambda = coeff_x -> lambda = 2PI / coeff_x
                    const lambda = 2 * Math.PI / coeff_x; 
                    const v = lambda * f;

                    const pX = (freq_lambda_ratio === '2\\pi') ? '2\\pi' : (freq_lambda_ratio === '\\pi' ? '\\pi' : '0.5\\pi');

                    const ans = `${v} \\text{ m/s}`;
                    const trap1 = `${v * 1000} \\text{ mm/s}`; // Nhầm đơn vị của u ráp sang v
                    const trap2 = `${roundTo(v * Math.PI, 1)} \\text{ m/s}`; // Quên khử pi
                    const trap3 = `${roundTo(v / Math.PI, 1)} \\text{ m/s}`; 

                    const opts = shuffleArray([ans, trap1, trap2, trap3]);

                    return {
                        type: 'mcq',
                        question: `Một sóng cơ hình sin truyền dọc theo trục Ox với phương trình \\( u = ${amp} \\cos(${f*2}\\pi t - ${pX} x) \\) (mm), trong đó \\( x \\) tính bằng mét và \\( t \\) độ bằng giây. Tốc độ truyền sóng là:`,
                        options: opts.shuffled.map(o => `\\( ${o} \\)`),
                        correctAnswer: opts.correctIndex,
                        explanation: `Sử dụng phương trình chuẩn \\( u = A \\cos(\\omega t - \\frac{2\\pi x}{\\lambda}) \\). <br/> Đồng nhất hệ số: \\( \\omega = ${f*2}\\pi \\Rightarrow f = ${f}\\text{ Hz} \\). <br/> \\( \\frac{2\\pi}{\\lambda} = ${pX} \\Rightarrow \\lambda = ${lambda}\\text{ m} \\). <br/> Tốc độ \\( v = \\lambda f = ${lambda} \\times ${f} = ${v}\\text{ m/s} \\).`
                    };
                }
            ],
            tf: [
                () => {
                    const l = randomChoice([1.2, 1.5, 2.0]);
                    const k = randomInt(3, 5); // Số bụng
                    const a_mm = randomInt(3, 8); // Biên độ bụng
                    
                    const lambda = (2 * l) / k; // m
                    const distNodeAntinode = lambda / 4; // m

                    return {
                        type: 'tf_cluster',
                        context: `Trên một sợi dây đàn hồi chiều dài \\( L = ${l} \\text{ m} \\), hai đầu cố định đang có hệ sóng dừng ổn định với ${k} bụng sóng. Biên độ dao động của phần tử tại điểm bụng là \\( a = ${a_mm} \\text{ mm} \\).`,
                        statements: [
                            { 
                                text: `Bước sóng truyền trên dây là ${roundTo(lambda, 2)} m.`, 
                                isTrue: true, 
                                explanation: `Sóng dừng 2 đầu cố định \\( L = k\\frac{\\lambda}{2} \\Rightarrow \\lambda = \\frac{2L}{k} = \\frac{2 \\times ${l}}{${k}} = ${roundTo(lambda, 2)} \\text{ m} \\).` 
                            },
                            { 
                                text: `Khoảng cách giữa một nút và một bụng dao động cực đại liền kề nhau dọc dây là ${roundTo(lambda/2, 2)} m.`, 
                                isTrue: false, 
                                explanation: `Khoảng cách giữa nút và bụng liền kề luôn bằng \\( \\frac{\\lambda}{4} = ${roundTo(distNodeAntinode, 2)} \\text{ m} \\), không phải ${roundTo(lambda/2, 2)} m.` 
                            },
                            { 
                                text: "Tất cả các phần tử trên cùng một bó sóng luôn dao động cùng pha với nhau.", 
                                isTrue: true, 
                                explanation: "Mỗi bó sóng ngăn cách bởi 2 nút được tạo từ hệ vật chất uốn nắn lên xuống đồng loạt, do đó pha của chúng đều như nhau." 
                            },
                            { 
                                text: "Tốc độ dao động cực đại của điểm bụng trong thời gian chuyền pha bằng tốc độ truyền sóng trên dây.", 
                                isTrue: false, 
                                explanation: "Tốc độ phần tử dao động \\( v_{max} = \\omega a \\) hoàn toàn khác với tốc độ truyền màng sóng năng lượng \\( v = \\lambda f \\)." 
                            }
                        ]
                    };
                }
            ],
            sa: [
                () => {
                    const LA = randomChoice([50, 60, 70]);
                    const RA = randomChoice([5, 10, 20]);
                    const L_drop = randomChoice([10, 20]);
                    const LB = LA - L_drop;

                    // L_A - L_B = 20 log(Rb/Ra)
                    // (L_A - L_B) / 20 = log(Rb/Ra)
                    // 10^((LA-LB)/20) = Rb/Ra
                    const ratio = Math.pow(10, L_drop / 20);
                    const RB = RA * ratio;
                    const deltaR = Math.abs(RB - RA);

                    return {
                        type: 'sa',
                        question: `Tại điểm A cách nguồn âm điểm một khoảng ${RA} m, mức cường độ âm đo được là \\( L_A = ${LA} \\text{ dB} \\) (bỏ qua hấp thụ môi trường). Cần di chuyển máy thu âm từ A dọc theo đường thẳng ra xa nguồn thêm đọan bằng bao nhiêu mét để mức cường độ âm giảm còn \\( ${LB} \\text{ dB} \\)?`,
                        correctAnswer: roundTo(deltaR, 1),
                        suffix: "m",
                        explanation: `Theo tính chất nguồn âm điểm và hình cầu truyền, \\( L_A - L_B = 20 \\log\\left(\\frac{R_B}{R_A}\\right) \\).<br/> Thay giá trị: \\( ${LA} - ${LB} = 20 \\log\\left(\\frac{R_B}{${RA}}\\right) \\Rightarrow \\log\\left(\\frac{R_B}{${RA}}\\right) = ${L_drop / 20} \\).<br/>Suy ra \\( R_B = ${RA} \\times 10^{${L_drop/20}} = ${roundTo(RB, 1)} \\text{ m} \\).<br/>Quãng đường dịch chuyển (tương tự độ hụt xê dịch) \\( \\Delta R = R_B - R_A = ${roundTo(deltaR, 1)} \\text{ m} \\).`
                    };
                }
            ]
        },
        'dien-truong': {
             mcq: [
                 () => {
                     const E = randomInt(2, 6) * 1000;
                     const d_cm = randomInt(2, 8);
                     const d = d_cm / 100;
                     const q_mag_eV = 1.6; // e-19
                     
                     // Wd = qEd = 1.6e-19 * E * d
                     const Wd_pow = -19 + 3; // roughly -16
                     const Wd_val = q_mag_eV * (E/1000) * d; // x 10^-16 J
                     // normalize
                     let val = roundTo(Wd_val, 2);
                     let pow = -16;
                     if(val < 1) { val *= 10; pow -= 1; }

                     const ans = `${val} \\times 10^{${pow}} \\text{ J}`;
                     const trap1 = `-${val} \\times 10^{${pow}} \\text{ J}`;
                     const trap2 = `${roundTo(val*2,2)} \\times 10^{${pow-1}} \\text{ J}`;
                     const trap3 = `0 \\text{ J}`;

                     const opts = shuffleArray([ans, trap1, trap2, trap3]);

                     return {
                         type: 'mcq',
                         question: `Một electron (\\( q = -1.6 \\times 10^{-19}\\text{ C} \\)) được thả nhẹ từ trạng thái nghỉ tại một điểm trong điện trường đều có các đường sức theo phương thẳng đứng từ trên xuống, với \\( E = ${E} \\text{ V/m} \\). Bỏ qua trọng lực. Động năng của electron sau khi nó di chuyển được đoạn đường \\( d = ${d_cm} \\text{ cm} \\) là:`,
                         options: opts.shuffled.map(o => `\\( ${o} \\)`),
                         correctAnswer: opts.correctIndex,
                         explanation: `Electron mang điện âm, do vậy nó phải chịu lực điện \\( \\vec{F} = q \\vec{E} \\) hướng ngược đường sức (hướng lên trên). Chiều di chuyển cùng hướng với lực sinh công dương.<br/>Định lí động năng lúc thả nhẹ: \\( \\Delta W_d = A = |q|Ed \\)<br/> \\( \\Rightarrow W_d = (1.6 \\times 10^{-19}) \\times ${E} \\times ${d} = ${val} \\times 10^{${pow}} \\text{ J} \\). (Động năng không thể mang giá trị âm).`
                     }
                 }
             ],
             tf: [
                 () => {
                     return {
                         type: 'tf_cluster',
                         context: `Một hạt bụi lơ lửng nằm cân bằng trong khoảng không giữa hai bản của tụ phẳng song song theo phương ngang. Bản trên mang điện tích dương, bản dưới mang điện tích âm. Bỏ qua lực đẩy Ác-si-mét.`,
                         statements: [
                             { 
                                 text: "Điện thế tại điểm sát vách bản trên lớn hơn so với tại điểm sát vách bản dưới.", 
                                 isTrue: true, 
                                 explanation: "Đường sức tĩnh điện có chiều từ dương sang âm (trên xuống dưới). Thuận chiều điện trường thì điện thế giảm." 
                             },
                             { 
                                 text: "Hạt bụi lơ lửng được trong hệ trên chỉ có thể nếu nó mang điện tích dương.", 
                                 isTrue: false, 
                                 explanation: "Cân bằng lực xảy ra khi lực điện \\( F_{dien} \\) hướng lên chống lại trọng lực. Vì \\( \\vec{E} \\) hướng từ trên xuống, nên để \\( \\vec{F} \\) ngược hướng \\( \\vec{E} \\), điện tích phải mang dấu âm." 
                             },
                             { 
                                 text: "Nếu kéo dãn hai bản tụ xa nhau ra hơn (trong khi máy phát vẫn duy trì nguồn điện kín), hạt bụi sẽ rơi xuống.", 
                                 isTrue: true, 
                                 explanation: "Khi duy trì nguồn tĩnh (nối tụ với acquy hiệu điện thế \\( U \\) không đổi), cường độ điện trường \\( E = \\frac{U}{d} \\). Việc kéo dãn \\( d \\) làm \\( E \\) giảm, dẫn đến lực đẩy tĩnh điện \\( F = qE \\) yếu đi không còn đỡ nổi trọng lực, hạt rơi xuống." 
                             },
                             { 
                                 text: "Công của lực tĩnh điện tác dụng lên hạt trên một lộ trình khép kín bất kì luôn bằng 0.", 
                                 isTrue: true, 
                                 explanation: "Trường tĩnh điện là trường thế, công của lực tĩnh điện trên một quỹ đạo khép kín luôn bằng 0." 
                             }
                         ]
                     }
                 }
             ],
             sa: [
                 () => {
                     const E_coeff = randomChoice([2.0, 2.5, 3.0, 4.0]);
                     const E = E_coeff * Math.pow(10, 4); // V/m
                     const v_coeff = randomChoice([1.2, 1.5, 2.0]);
                     const v_max = v_coeff * Math.pow(10, 6); // m/s
                     
                     // a = (qE)/mp = (1.6 * E_coeff * 10^-15) / 1.67e-27 = (1.6 * E_coeff / 1.67) * 10^12
                     const a = (1.6 * E_coeff / 1.67) * Math.pow(10, 12);
                     // t = v/a = (v_coeff * 10^6) / a = (v_coeff * 1.67) / (1.6 * E_coeff) * 10^-6
                     const t_seconds = (v_coeff * 1.67) / (1.6 * E_coeff) * Math.pow(10, -6);
                     const t_micro = t_seconds * 1000000;
                     const final_ans = roundTo(t_micro, 1);

                     return {
                         type: 'sa',
                         question: `Máy gia tốc tuyến tính tạo một điện trường đều \\( E = ${E_coeff} \\times 10^{4} \\text{ V/m} \\) để gia tốc khối proton (\\( m = 1.67 \\times 10^{-27} \\text{ kg}, q = 1.6 \\times 10^{-19} \\text{ C} \\)). Từ lúc chạm vùng điện trường ở trạng thái nghỉ, thời gian theo \\( \\mu s \\) (làm tròn số thập phân thứ nhất) cần để đạt tốc độ vòng tua \\( v = ${v_coeff} \\times 10^{6} \\text{ m/s} \\) là bao nhiêu?`,
                         correctAnswer: final_ans,
                         suffix: "\\( \\mu s \\)",
                         explanation: `Gia tốc hạt: \\( a = \\frac{qE}{m} = \\frac{1.6\\cdot 10^{-19} \\times ${E}}{1.67\\cdot 10^{-27}} \\approx ${roundTo(a/1e12, 3)}\\cdot 10^{12} \\text{ m/s}^2 \\).<br/>Sử dụng \\( v = at \\Rightarrow t = \\frac{v}{a} = \\frac{${v_coeff}\\cdot 10^6}{a} \\approx ${t_seconds}\\text{ s} \\).<br/>Đổi ra microsecond: \\( t = ${final_ans} \\mu s \\).`
                     }
                 }
             ]
        },
        'dong-dien': {
            mcq: [
                 () => {
                     const ans = `\\text{Tăng dần đến } \\mathcal{E}`;
                     const trap1 = `\\text{Luôn không đổi bằng } \\mathcal{E}`;
                     const trap2 = `\\text{Giảm dần về 0}`;
                     const trap3 = `\\text{Tăng dần tiếp sau đó giảm dán}`;

                     const opts = shuffleArray([ans, trap1, trap2, trap3]);

                     return {
                         type: 'mcq',
                         question: "Nối hai cực của một hệ điện thế (suất điện động \\( \\mathcal{E} \\), điện trở trong \\( r \\)) với mạch ngoài có điện trở \\( R \\) có thể điều chỉnh tự do. Dựa vào định luật Ohm toàn mạch, khi xoay \\( R \\) bắt đầu tăng dần từ vạch 0 lên đến vô cùng, hiệu điện thế đo tại hai cực của nguồn điện phân biến thiên như thế nào?",
                         options: opts.shuffled.map(o => `\\( ${o} \\)`),
                         correctAnswer: opts.correctIndex,
                         explanation: `Cường độ \\( I = \\frac{\\mathcal{E}}{R+r} \\). Hiệu điện thế hai cực: \\( U = \\mathcal{E} - Ir = \\mathcal{E} - \\frac{\\mathcal{E}r}{R+r} \\).<br/> Khi R tăng dần tới vô cùng, cường độ dòng điện I biến thiên giảm dần về 0, do đó độ giảm thế trong \\( Ir \\) nhỏ đi. Hiệu điện thế ngoài tụ hội lên đỉnh xấp xỉ \\( \\mathcal{E} \\) lúc mạch hở hở.`
                     }
                 }
            ],
            tf: [
                () => {
                    const E = randomChoice([12, 24]);
                    const r = randomChoice([2, 4]); // omh
                    
                    let Udm = 6; let Pdm = 3;
                    if(E === 24) { Udm = 12; Pdm = 6; }
                    
                    const Rd = (Udm * Udm) / Pdm;
                    const Idm = Pdm / Udm;

                    const R_bientro_sangbt = E / Idm - r - Rd; 
                    const fake_R = R_bientro_sangbt + randomInt(1, 3)*2; // sai so

                    return {
                         type: 'tf_cluster',
                         context: `Hệ kín gồm nguồn đo được \\( \\mathcal{E} = ${E}\\text{ V}, r = ${r}\\ \\Omega \\) nối cực với một biến trở \\( R \\) mắc nối tiếp với một đèn dây tóc ghi \\( ${Udm}\\text{ V} - ${Pdm}\\text{ W} \\). Coi điện trở dây tóc bóng đèn \\( R_d \\) là không đổi theo nhiệt độ.`,
                         statements: [
                            { 
                                text: `Điện trở danh nghĩa của dây điện trở bóng đèn là ${Rd} Ohm.`, 
                                isTrue: true, 
                                explanation: `Đúng. Áp dụng công thức giải định mức \\( R_d = \\frac{U_{dm}^2}{P_{dm}} = \\frac{${Udm}^2}{${Pdm}} = ${Rd} \\ \\Omega \\).` 
                            },
                            { 
                                text: `Để đèn cho tỏa sáng chuẩn bình thường, biến trở phải trượt tại mốc \\( R = ${fake_R}\\ \\Omega \\).`, 
                                isTrue: false, 
                                explanation: `Dòng định mức: \\( I_{dm} = \\frac{P_{dm}}{U_{dm}} = ${Idm} \\text{ A} \\). Phải ráp mạch: \\( I = \\frac{\\mathcal{E}}{R + R_d + r} \\Rightarrow R = \\frac{${E}}{${Idm}} - ${Rd} - ${r} = ${R_bientro_sangbt}\\ \\Omega \\). Phát biểu báo ${fake_R} Ohm là sai lệch thiết kế.` 
                            },
                            { 
                                text: `Nếu không may biến trở bị trượt gạt về mốc 0 Ohm, đèn có thể bị hỏng lập tức.`, 
                                isTrue: true, 
                                explanation: `Lúc chập nấc \\( R=0 \\), \\( I_{max} = \\frac{\\mathcal{E}}{R_d + r} = \\frac{${E}}{${Rd + r}} \\approx ${roundTo(E/(Rd+r), 2)} \\text{ A} \\). Giá trị này cao hơn ngạch chuẩn (\\( I_{dm}=${Idm} \\text{ A} \\)), khiến đèn hư hại bốc cháy đứt dây sợi.` 
                            },
                            { 
                                text: `Khi giá trị \\( R \\) giảm dần từ vô cùng về 0, công suất tiêu thụ mạch ngoài luôn giảm.`, 
                                isTrue: false, 
                                explanation: `Công suất mạch ngoài \\( P_n \\) đạt cực đại tại hiện tượng cộng hưởng trở \\( R_n = R + R_d = r \\). Biến thiên làm thay đổi đa điểm nên quá trình này thực ra làm \\( P_n \\) lúc lên lúc xuống parabol hoặc nếu \\( R_d > r \\) thì nó đi 1 nhánh thôi. Cụ thể ở bài này, \\( R_d = ${Rd} \\Omega > r \\) nên khi \\( R \\) giảm tổng mạch thu sát lại \\( r \\) giúp \\( P_n \\) LUÔN TĂNG!` 
                            }
                         ]
                     }
                }
            ],
            sa: [
                () => {
                    const E = randomInt(4, 8); // 4-8 v
                    const r = 1;
                    const R1 = randomChoice([2.5, 3.5]);
                    const Rp = randomChoice([4.0, 5.0]); // Agno3
                    const timesec = randomInt(1500, 2000); // around 30'

                    // bo song song
                    const Eb = E;
                    const rb = r / 2;
                    const Rn = R1 + Rp;
                    const I = Eb / (Rn + rb);

                    const k = 1.118; // mg/C
                    // m = k * I * time / 1000
                    const m_grams = (k * I * timesec) / 1000;
                    const final_ans = roundTo(m_grams, 2);

                    const mins = Math.floor(timesec/60);
                    const secs = timesec % 60;

                    return {
                         type: 'sa',
                         question: `Hai nguồn ghép song song, mỗi nguồn có suất điện động \\( \\mathcal{E} = ${E}\\text{ V} \\) và \\( r = ${r}\\ \\Omega \\). Mạch ngoài gồm \\( R_1 = ${R1}\\ \\Omega \\) mắc nối tiếp bình điện phân dung dịch \\( \\text{AgNO}_3 \\) cực bạc (điện trở \\( R_p = ${Rp}\\ \\Omega \\)). Lấy hệ số điện hóa của Bạc là \\( k = 1.118 \\text{ mg/C} \\). Tính khối lượng kim loại Bạc bám vào catốt sau ${mins} phút ${secs} giây (tính bằng gram, làm tròn số thập phân thứ 2).`,
                         correctAnswer: final_ans,
                         suffix: "g",
                         explanation: `Ghép 2 nguồn chuẩn nối tiếp song song: \\( E_b = ${E}\\text{ V}, r_b = ${roundTo(r/2, 2)}\\ \\Omega \\). <br/> Định luật Ohm tính cường độ toàn vi: \\( I = \\frac{E_b}{R_1 + R_p + r_b} = \\frac{${E}}{${R1} + ${Rp} + ${rb}} = ${roundTo(I, 3)}\\text{ A} \\).<br/> Cường dẫn quy đổi giây \\( t = ${timesec}\\text{ s} \\).<br/> Định luật dòng Faraday: \\( m = k \\cdot I \\cdot t = (1.118\\cdot 10^{-3}) \\times ${roundTo(I, 3)} \\times ${timesec} = ${final_ans} \\text{ g} \\).`
                     }
                }
            ]
        }
    };

    // Public API
    window.PhysicsQuizDB = {
        getSeeds: (topic) => seeds[topic] || {},
        generateQuestion: (topic, type) => {
            const topicSeeds = seeds[topic];
            if(!topicSeeds || !topicSeeds[type] || topicSeeds[type].length === 0) return null;
            // Pick a random seed
            const seeder = topicSeeds[type][Math.floor(Math.random() * topicSeeds[type].length)];
            return seeder();
        }
    };

    console.log('[Quiz Database] Parameterized Seed Architecture loaded successfully.');
})();
