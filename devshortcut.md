# Dev Shortcut

To jest prosty, aktualny skrot zmian w aplikacji.
Piszemy tu zwyklym jezykiem, bez technicznego zargonu.

## 2026-04-04 - PWA: instalacja, offline i aktualizacje

### Dodano

- Aplikacje mozna teraz latwiej zainstalowac jak normalne narzedzie na telefonie lub komputerze.
- Aplikacja pokazuje, gdy czeka nowa wersja.
- Pojawil sie ekran offline, gdy chwilowo nie ma internetu.
- W gornej belce jest przycisk do instalacji albo aktualizacji.

### Poprawiono

- Aplikacja lepiej zapisuje potrzebne pliki do pracy offline.
- Ikony i skroty po instalacji dzialaja pewniej.
- Przegladarka dostaje prosbe, zeby rzadziej sama czyscila lokalne dane aplikacji.

---

## 2026-04-04 - Porzadki po starym PWA

### Poprawiono

- Usunieto stary plik `sw.js`, ktory nie byl juz potrzebny.
- Aplikacja sama sprzata stare wpisy i cache po dawnym service workerze.
- Zostala jedna glowna sciezka PWA, dzieki czemu latwiej uniknac problemow z przestarzala wersja strony.

---

## 2026-04-04 - Podsumowania tygodniowe i miesieczne

### Dodano

- Na dashboardzie pojawily sie 2 nowe karty:
  - podsumowanie tygodnia
  - podsumowanie miesiaca
- Karty pokazuja w prosty sposob:
  - ile bylo treningow
  - ile bylo cardio
  - ile bylo krokow i kalorii
  - czy zmienila sie sylwetka, jesli byly wpisane pomiary
- Karty porownuja obecny tydzien i miesiac do poprzedniego.

### Poprawiono

- Podsumowania licza sie lokalnie z danych zapisanych w aplikacji, wiec nie potrzebuja internetu ani konta.

---

## 2026-04-04 - Szybkie usprawnienia i wygodniejsze logowanie

### Dodano

- W treningu mozna teraz wybrac date wpisu, wiec da sie zapisac np. wczorajszy trening.
- Na dashboardzie sa szybkie przyciski do dodania cardio i pomiaru sylwetki.
- W ustawieniach sa import i eksport danych sylwetki.

### Poprawiono

- W cardio dystans nie jest juz opcjonalny. To on jest podstawa do liczenia tempa i predkosci.
- Zmieniono czesc nazw i tekstow, zeby byly bardziej naturalne.
- "Poradnik" zostal przemianowany na "Encyklopedie cwiczen".
- W encyklopedii poprawiono uklad kart cwiczen i usunieto zbedne ozdobniki.
- Kategorie w encyklopedii nie wymagaja juz przesuwania w bok, zeby zobaczyc wszystkie.
- W ustawieniach doprecyzowano opis usuwania danych i nadal trzeba wpisac `TAK`, zeby potwierdzic kasowanie wszystkiego.

---

## 2026-04-04 - Stabilnosc i male ekrany

### Poprawiono

- Naprawiono blad z zapisem powiadomien, przez ktory swieza notyfikacja mogla zostac nadpisana.
- Dashboard, Cardio i kilka innych widokow lepiej dopasowuja sie teraz do mniejszych ekranow.
- Aplikacja lepiej nadaje sie do uzywania jako PWA na telefonie.

---

## Wczesniej - najwazniejsze etapy rozwoju

### Dodano

- Dashboard jako glowny ekran aplikacji.
- Modul treningu z planem tygodnia.
- Modul cardio.
- Modul sylwetki i pomiarow.
- Rest timer.
- Kalkulator 1RM.
- Profil uzytkownika.
- Wykresy i statystyki.
- Backupy i import/export danych.

## Najkrocej

Na poczatku powstala baza: trening, cardio, sylwetka i dashboard.
Potem doszly szybsze wpisy, backupy i wygodniejsze zarzadzanie danymi.
Nastepnie poprawiona zostala stabilnosc, responsywnosc i PWA.
Na koncu doszly prostsze teksty, lepszy UX i lokalne podsumowania tygodnia oraz miesiaca.
