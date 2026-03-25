# Automatizuotų testų laboratorinis darbas

## 1. Darbo tikslas

Šio darbo tikslas buvo sukurti patikimą automatizuotų testų rinkinį, kuris apimtų:
- UI testavimą su Playwright + TypeScript.
- API testavimą su Postman kolekcija + Newman vykdymu.
- OAuth2 autentikaciją Gmail API scenarijui.
- Paleidimą lokaliai ir CI aplinkoje (GitHub Actions).

Trumpai: darbas imituoja realų QA procesą, kai tikrinamas ir vartotojo sąsajos funkcionalumas, ir integraciniai API srautai.

## 2. Kokią architektūrą pasirinkau ir kodėl

Pasirinkau mišrią architektūrą:
- UI dalis: Playwright testai TypeScript kalba.
- API dalis: Postman kolekcija su Newman paleidimu per PowerShell skriptus.
- CI dalis: GitHub Actions workflow su paslaptimis (secrets).

Kodėl tai logiška:
- Playwright tinka greitiems ir stabiliai sinchronizuotiems UI testams.
- Postman kolekcijos leidžia aiškiai modeliuoti API srautą žingsnis po žingsnio.
- Newman leidžia tą pačią kolekciją paleisti automatiškai (lokaliai/CI).
- Tokia kombinacija atitinka realias komandines praktikas.

## 3. Projekto struktūra ir atsakomybės

Pagrindinės dalys:
- tests/: UI testai (Task2.*, Task3.*, Task4.*, ecommerce).
- postman/: Gmail API kolekcija ir environment.
- scripts/: PowerShell skriptai Newman paleidimui.
- .github/workflows/: automatinio CI paleidimo konfiguracija.
- test-results/: sugeneruotos ataskaitos.

Tai atskiria atsakomybes:
- Testų logika gyvena testuose/kolekcijoje.
- Paleidimo logika gyvena skriptuose.
- Infrastruktūra ir automatika gyvena CI workflow faile.

## 4. Kodėl pasirinkau OAuth2 (ir kodėl būtent refresh token srautą)

Gmail API yra apsaugotas, todėl vien vartotojo slaptažodžio neužtenka. Reikia prieigos žetono (access token), kuris išduodamas per OAuth2.

Kodėl OAuth2:
- Tai standartinis ir saugus autorizacijos mechanizmas.
- API prieiga yra granulari ir kontroliuojama scope bei token gyvavimo laiku.
- Tai pramoninis standartas integracijoms su Google API.

Kodėl pasirinktas refresh token modelis (Option B):
- Access token yra trumpalaikis ir greitai baigiasi.
- Refresh token leidžia automatiškai gauti naują access token prieš testų vykdymą.
- Dėl to testai stabilesni CI aplinkoje ir mažiau rankinio darbo.

Kitaip tariant, Option B sumažina trapią vietą: nebereikia ranka kas kartą generuoti access token.

## 5. Kaip techniškai veikia OAuth2 dalis mano projekte

Vykdymo eiga:
1. Skriptas gauna ClientId, ClientSecret ir RefreshToken.
2. Kreipiasi į Google token endpoint su grant_type=refresh_token.
3. Iš atsakymo paima access_token.
4. Paleidžia Newman ir perduoda gmail_access_token kaip env kintamąjį.
5. Postman kolekcija naudoja Bearer token autentikaciją.

Papildoma nauda:
- Slaptų duomenų nerašau į testus.
- CI naudoja GitHub secrets.
- Lokalioje aplinkoje galiu paleisti su parametrais.

## 6. Gmail API scenarijaus (Exercise 2.1) logika

Scenarijus realizuotas kaip pilnas ciklas su cleanup:
1. Preconditions: profilis + random testiniai duomenys.
2. Siunčiamas laiškas.
3. Sukuriama nauja label.
4. Label priskiriama išsiųstam laiškui.
5. Laiškai filtruojami pagal sukurtą label.
6. Postconditions: nuimama label, ištrinamas label, laiškas perkeliamas į trash.

Kodėl toks srautas geras gynimui:
- Parodo ne tik "happy path", bet ir testinių artefaktų tvarkymą.
- Sistema po testo paliekama tvarkinga (mažiau "šiukšlių").
- Toks požiūris yra brandesnis nei tiesiog "paleidau vieną request".

## 7. Playwright UI testų sprendimai ir motyvacija

### 7.1 Task2.1 (e-commerce end-to-end)

Ką testas daro:
- Prisijungia.
- Išvalo krepšelį.
- Knygų kategorijoje pasirenka prekes virš kainos slenksčio.
- Prideda prekes į krepšelį.
- Keičia kiekį.
- Tikrina aritmetiką (unit price * qty = line total).
- Tikrina bendrą subtotal.
- Pereina į checkout.

Kodėl taip sukurta:
- Testas tikrina verslo logiką, ne tik elementų paspaudimą.
- Dinaminė prekių atranka pagal kainą sumažina hardcode priklausomybę.
- Papildomos validacijos (subtotal ir eilutės total) leidžia rasti realesnes klaidas.

### 7.2 Task3.1 ir Task3.2 (dinamika ir sinchronizacija)

Kodėl naudojau expect.poll ir aiškius timeout:
- Tokiu būdu testas laukia būsenos pasikeitimo, o ne naudoja "sleep".
- Tai stabilesnis ir profesionalesnis sinchronizacijos būdas.
- Mažėja flaky testų tikimybė.

### 7.3 Task4.1 (data-driven testavimas)

Kodėl pasirinkta data-driven:
- Tas pats testinis srautas validuojamas keliems vartotojų rinkiniams.
- Mažiau kodo dubliavimo.
- Lengva plėsti testus tiesiog papildant JSON duomenis.

Papildomai:
- Naudojami test.step blokai, todėl ataskaitose aiškiai matosi kurioje vietoje įvyko klaida.

## 8. CI automatizavimas ir jo vertė

GitHub Actions workflow atlieka:
- Dependencijų įrašymą.
- Secrets validaciją.
- Gmail Newman testų paleidimą.
- HTML ataskaitos įkėlimą kaip artifact.

Kodėl tai svarbu:
- Testai paleidžiami ne tik lokaliai, bet ir neutralioje CI aplinkoje.
- Galima turėti suplanuotą paleidimą (schedule), taigi gaunama periodinė kokybės kontrolė.
- Dėstytojui aiškiai parodoma, kad sprendimas yra automatiškai atkartojamas.

## 9. Su kokiais iššūkiais susidūriau ir kaip sprendžiau

Galimi realūs iššūkiai, kuriuos verta paminėti per gynimą:
- Access token galiojimo pabaiga.
  Sprendimas: naudotas refresh token srautas (Option B).
- Nestabilūs UI elementų pasikeitimai laike.
  Sprendimas: expect.poll, tiksliniai lokatoriai, būsenos laukimas.
- Testinių duomenų "šiukšlės" (label/laiškai).
  Sprendimas: aiškus cleanup žingsnių blokas API kolekcijoje.
- Skirtumai tarp lokalaus paleidimo ir CI.
  Sprendimas: vienodi skriptai ir secrets mechanizmas.

## 10. Ką sakyti, jei paklausia "kodėl kodas būtent taip veikia"

Trumpa argumentavimo schema:
- Kiekvienas testas turi precondition -> action -> validation -> postcondition struktūrą.
- Validacijos neapsiriboja UI tekstu, tikrinama ir duomenų logika.
- OAuth2 dalyje pasirinktas ne rankinis token, o automatinis atnaujinimas dėl stabilumo.
- CI integracija įrodo, kad sprendimas ne vienkartinis, o pakartojamas.

## 11. Galimas 3-5 min gynimo kalbėjimo scenarijus

1. Įžanga:
   "Darbo tikslas buvo sukurti mišrų automatizuotų testų sprendimą: UI su Playwright ir API su Postman/Newman, bei užtikrinti OAuth2 autentikaciją Gmail scenarijui."

2. Architektūra:
   "UI testai gyvena tests kataloge, API scenarijus postman kataloge, vykdymo automatika scripts, o CI realizuota GitHub Actions. Taip aiškiai atskirtos atsakomybės."

3. OAuth2 argumentas:
   "Pasirinkau OAuth2, nes Gmail API kitaip nepasiekiamas saugiu ir standartiniu būdu. Naudojau refresh token modelį, nes access token trumpalaikis. Taip testai tapo stabilesni ir lengviau automatizuojami."

4. API scenarijus:
   "Sukūriau pilną srautą: nuo laiško siuntimo ir label kūrimo iki cleanup veiksmų. Tai rodo ne tik funkcionalumo patikrą, bet ir tvarkingą testinės aplinkos valdymą."

5. UI scenarijai:
   "E-commerce teste tikrinau ne tik paspaudimus, bet ir skaičiavimų teisingumą. Dynamic testuose naudojau būsenos laukimą per expect.poll, kad išvengčiau flaky testų. Task4.1 padariau data-driven principu."

6. Užbaigimas:
   "Sprendimas veikia lokaliai ir CI aplinkoje, generuoja ataskaitas, naudoja saugų autentikavimą ir yra lengvai plečiamas."

## 12. D.U.K

1. Kodėl nepakako vien access token?
Atsakymas: Nes jis trumpalaikis. Refresh token leidžia prieš kiekvieną vykdymą automatiškai gauti naują access token.

2. Kodėl pasirinkai Playwright, o ne Selenium?
Atsakymas: Playwright turi patikimesnį auto-waiting, patogias API lokatoriams ir geresnį stabilumą moderniems SPA/puslapiams.

3. Kaip sumažinai flaky testus?
Atsakymas: Naudojau expect.poll, aiškius lokatorius, būsenos pagrindu grįstą laukimą ir vengiau fiksuotų sleep.

4. Kaip užtikrinai, kad testai nepalieka šiukšlių?
Atsakymas: API kolekcijoje yra postconditions: nuimu label, trinu label ir perkeliu laišką į trash.

5. Kaip įrodei, kad sprendimas produkciškai pritaikomas?
Atsakymas: Testai paleidžiami ir lokaliai, ir GitHub Actions, naudojami secrets, o rezultatai archyvuojami kaip artifact.

## 13. Ką rodyti ekrane
- Projekto struktūrą ir kur kas yra.
- Gmail kolekcijos srautą (1 -> 8 žingsniai).
- run-newman-gmail.ps1 skriptą (token refresh + newman paleidimas).
- Vieną Playwright testą su aiškiomis validacijomis.
- Sugeneruotą HTML report.
- GitHub Actions run + artifact.

## 14. Mano darbo stiprybės (galutinis akcentas)

- Integruotas UI + API testavimas.
- Teisingai panaudotas OAuth2 su refresh token automatizacija.
- Tvarkingas cleanup po testų.
- Data-driven testavimo principo pritaikymas.
- CI integracija ir ataskaitų generavimas.

Jei reikėtų plėtros: papildyčiau neigiamais scenarijais, didesniu duomenų variantiškumu ir paralelizuotu paleidimu.
