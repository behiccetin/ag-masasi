# Katkı rehberi / Contributing guide

## Türkçe

### Yeni bir dil eklemek

Ağ Masası'nın bütün metinleri `diller/` klasöründeki JSON dosyalarındadır. Yeni bir dil eklemek için programlama bilmeniz gerekmez.

1. `diller/en.json` dosyasını kopyalayın ve dilinizin kısa koduyla adlandırın, örneğin `diller/de.json` (Almanca) ya da `diller/az.json` (Azerbaycan Türkçesi).
2. Dosyanın başındaki üç alanı doldurun:
   - `"_kod"`: dil kodu, dosya adıyla aynı (`"de"`).
   - `"_ad"`: dilin kendi dilindeki adı (`"Deutsch"`).
   - `"_cevirmen"`: adınız.
3. Yalnızca **değerleri** çevirin; anahtarlara (iki nokta üst üsteden önceki kısım) dokunmayın.
4. `{0}`, `{1}` gibi yer tutucuları çeviride aynen koruyun; sırası değişebilir.
5. `ipucu` ve `yardim` içindeki metinlerde yalnızca şu biçim etiketleri kullanılabilir: `<p>`, `<b>`, `<strong>`, `<i>`, `<em>`, `<ol>`, `<ul>`, `<li>`, `<br>`, `<code>`, `<kbd>`. Diğer etiketler güvenlik nedeniyle düz metne çevrilir.
6. PageRank, HITS, QAP, MRQAP, Louvain gibi yöntem adları uluslararası adlardır; bunları değiştirmeyin.
7. `yontem` alanı rapordaki yöntem metnidir; `{n}`, `{q}` gibi adlandırılmış yer tutucuları aynen koruyun.
8. Çevirmediğiniz anahtarlar İngilizce görünür; bu yüzden çeviriyi parça parça da gönderebilirsiniz.

### Göndermek

- GitHub kullanıyorsanız dosyayı `diller/` klasörüne ekleyip bir *pull request* açın.
- GitHub kullanmıyorsanız dosyayı geliştiriciye e-postayla gönderin.

Onaylanan diller bir sonraki sürümde araca gömülür. Gömülene kadar herkes aracın **Proje > Dil dosyası yükle** menüsüyle dosyayı kendisi ekleyebilir.

### Denemek

Dosyanızı göndermeden önce aracı açın, **Proje > Dil dosyası yükle** ile seçin ve sekmeleri gezin. Taşan ya da yanlış duran metinleri düzeltin.

### Aracı derlemek

```
npm install
python3 build.py   # dist/ag-masasi.html ve index.html
```

## English

### Adding a new language

All texts of Ağ Masası (Screening Desk) live in the JSON files in the `diller/` folder. You do not need to know programming.

1. Copy `diller/en.json` and name it with your language code, for example `diller/de.json`.
2. Fill in the three fields at the top: `"_kod"` (language code, same as the file name), `"_ad"` (the language name in that language) and `"_cevirmen"` (your name).
3. Translate the **values** only; do not change the keys.
4. Keep placeholders such as `{0}` and `{1}`; their order may change.
5. In `ipucu` and `yardim`, only these tags are allowed: `<p>`, `<b>`, `<strong>`, `<i>`, `<em>`, `<ol>`, `<ul>`, `<li>`, `<br>`, `<code>`, `<kbd>`. Other tags are turned into plain text for security.
6. Method names such as PageRank, HITS, QAP, MRQAP and Louvain are international names; do not change them.
7. `yontem` is the method text of the report; keep named placeholders such as `{n}` and `{q}` exactly as they are.
8. Missing keys fall back to English, so partial translations are welcome.

Open a pull request adding your file to `diller/`, or e-mail it to the developer. Accepted languages are bundled in the next release. Until then anyone can add the file through **Project > Load language file**.
