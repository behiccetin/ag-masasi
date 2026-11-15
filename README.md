# Ağ Masası (Ag Masasi) / Network Desk

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.24262475.svg)](https://doi.org/10.5281/zenodo.24262475)

Sosyal ağ analizi için tarayıcıda çalışan, kurulumsuz, ücretsiz araç. Bağ listesini, komşuluk matrisini, iki modlu veriyi, kaynakça dosyasını ya da Gephi, Pajek, UCINET dosyalarını okur; merkezilik ölçülerini, toplulukları, çekirdek-çevre yapısını, aracıları, triad sayımını, küçük dünya ve dayanıklılık analizlerini, QAP ve MRQAP testlerini hesaplar; yayına hazır ağ şeklini ve yöntem bölümü taslağını Word raporu olarak verir. Tek bir HTML dosyasıdır; internet bağlantısı kullanmaz, veriler bilgisayardan çıkmaz.

A free, install-free, browser-based tool for social network analysis. It reads edge lists, adjacency matrices, two-mode data, bibliography exports and Gephi, Pajek or UCINET files; computes centrality, communities, core-periphery structure, brokerage, the triad census, small-world and robustness analyses, and QAP and MRQAP tests; and delivers a publication-ready network figure and a draft method section in a Word report. It is a single HTML file, works offline, and data never leave your computer.

## Yöntemler / Methods

**Düğüm ölçüleri / Node measures (17):** derece, giriş ve çıkış derecesi, güç, arasındalık (Brandes), yakınlık (Wasserman-Faust düzeltmesi), harmonik yakınlık, özvektör, PageRank, HITS merkez ve otorite puanları, çekirdek numarası, yerel kümelenme, Burt kısıtlaması ve etkin büyüklük.

**Ağ ölçüleri / Network measures (14):** yoğunluk, ortalama derece, bileşenler, ortalama uzaklık, çap, geçişlilik, ortalama kümelenme, karşılıklılık, derece uyumu, Freeman merkezileşmesi.

**Gruplar ve yapı / Groups and structure:** Louvain toplulukları (çözünürlük, çok koşu, kararlılık), NMI, E-I endeksi ve permütasyon testi, kategorik ve sayısal uyum, Borgatti-Everett çekirdek-çevre modeli, kesme noktaları ve köprüler, triad ve diad sayımı, küçük dünya σ, hedefli ve rastgele düğüm kaybında dayanıklılık (R endeksi), eşitsizlik süzgeciyle omurga.

**Testler / Tests:** QAP korelasyonu, çift yarı kısmi permütasyonlu MRQAP, rastgele ağlarla karşılaştırma (koşullu tek biçimli çizge testi; yoğunluğu ya da derece dizisini koruyan), düğüm düzeyinde permütasyon testi (F ve η², Pearson r), asortativite testi (Newman), modülerliğin anlamlılığı (derece dizisini koruyan rastgele ağlarla). Her testin formülü arayüzde gösterilir.

## Çizim / Drawing

ForceAtlas2 ailesinden LinLog kuvvet yerleşimi (büyük ağlarda Barnes-Hut), çakışmayan etiket yerleşimi, grup alanları, renk körlüğüne uygun palet, siyah-beyaz baskı için şekiller, dergi, sunum, poster ve koyu biçemler, 600 dpi PNG, SVG ve etkileşimli HTML.

## Harita ve bayraklar / Maps and flags

Düğümler dünya ya da kıta haritası üzerinde (ülkeler), herhangi bir ülkenin birinci düzey idari bölümleri üzerinde (Türkiye'de 81 il; adla ya da plaka numarasıyla eşleşme), enlem ve boylam özellikleriyle ya da kullanıcının yüklediği GeoJSON haritasıyla yerleştirilebilir. Ülke düğümleri bayraklarıyla gösterilebilir.

Nodes can be placed on a world or continent map (countries), on the first-level administrative divisions of any country, by latitude and longitude attributes, or on a GeoJSON map supplied by the user. Country nodes can be drawn with their flags.

## Örnek projeler / Sample projects

- **Küresel gemi söküm ağı / Global shipbreaking network:** NGO Shipbreaking Platform yıllık söküm listeleri (https://shipbreakingplatform.org/annual-lists/), 2014, 2017, 2020 ve 2023. Bağ, geminin asıl sahibinin ülkesinden söküldüğü ülkeye yönelir; ağırlık toplam gros tonajdır. Kurgu Filiz ve Çetin (2026, https://doi.org/10.1504/IJSTL.2026.151953) çalışmasından alınmıştır. 2014 ve 2017 ağlarının düğüm, bağ ve derece değerleri makaledeki Tablo 1 ve 2 ile örtüşür; 2020'de bir bağ fazladır, 2023'te makale ABD'yi iki farklı yazımla iki düğüm saymıştır.
- **Bölümler arası akademik işbirliği:** kurgusal veri.

## Doğrulama / Verification

Ölçüler, rastgele üretilmiş 24 ağda (yönlü, yönsüz, ağırlıklı, parçalı) NetworkX 3.7 ve igraph 1.0 ile karşılaştırılmıştır: 690 karşılaştırmada fark bulunmamıştır. Ağırlıklı arasındalık, eşit uzunluktaki yolların kayan nokta hatasından etkilenmemesi için kesirli sayılarla hesaplanan uzaklıklarla denetlenmiştir. Çekirdek-çevre yerel araması, 30 ağda kaba kuvvetle bulunan en iyi çözüme ulaşmıştır. Louvain modülerliği, NetworkX'in 10 koşudaki en iyi sonucunun en fazla 0,01 altındadır.

Measures were compared with NetworkX 3.7 and igraph 1.0 on 24 random networks (directed, undirected, weighted, fragmented): no differences in 690 comparisons. The core-periphery local search reached the brute-force optimum in 30 networks.

Doğrulama betikleri / Verification scripts: `test/cekirdek_dogrula.py`, `test/cp_dogrula.py`.

## Kullanım / Usage

- **Web'de aç / Open on the web:** https://behiccetin.github.io/ag-masasi/
- **İndir / Download:** `dist/ag-masasi.html` dosyasını indirip çift tıklayın; internet gerekmez. / Download and double-click; no internet needed.

Web sürümü de verileri yalnızca tarayıcınızda tutar. / The web version also keeps data in your browser only.

## Klasörler / Folders

| Klasör | İçerik |
|---|---|
| `sablon.html` | Arayüz iskeleti |
| `stil.css` | daisyUI 5 ve Tailwind 4 tema tanımları |
| `js/` | Uygulama kodu (`2-ag.js` hesap çekirdeği, `4-ciz.js` çizim motoru) |
| `diller/` | Dil dosyaları (topluluk katkısına açık) |
| `yazi/` | Gömülü yazı yüzleri (TeX Gyre Heros, GUST Font License) |
| `build.py` | Hepsini tek HTML dosyasında birleştirir (`dist/` ve `index.html`) |

## Atıf / Citation

Ağ Masası'nı kullandıysanız lütfen kaynak gösterin. Araçtaki **Atıf** penceresi APA, İSNAD ve BibTeX biçimlerini verir.

Çetin, B. (2026). *Ağ Masası (Ag Masasi)* (Sürüm 1.0.0) [Bilgisayar yazılımı]. Zenodo. https://doi.org/10.5281/zenodo.24262476

Bütün sürümler için / For all versions: https://doi.org/10.5281/zenodo.24262475

## Lisans / License

Kod MIT Lisansı ile dağıtılır. Gömülü bileşenler:

- Yazı yüzleri: TeX Gyre Heros ve TeX Gyre Heros Condensed (GUST Font License, `yazi/GUST-FONT-LICENSE.txt`)
- Haritalar: Natural Earth 1:50m ülkeler ve 1:10m birinci düzey idari bölümler (kamu malı), sadeleştirilmiş
- Bayraklar: flag-icons, Panayiotis Lipiridis (MIT, `yazi/FLAG-ICONS-LICENSE.txt`)
- Örnek veri: NGO Shipbreaking Platform yıllık söküm listeleri (bu örneği kullananların Platform'a ve Filiz ve Çetin, 2026 çalışmasına atıf yapması rica olunur)

Öğr. Gör. Dr. Behiç ÇETİN, Burdur Mehmet Akif Ersoy Üniversitesi.
