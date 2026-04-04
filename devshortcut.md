# Dev Shortcut

Ten plik to prosty skrót zmian w aplikacji.
Jest napisany zwykłym językiem, bez technicznego żargonu.

## 2026-04-04 - Podsumowania tygodniowe i miesięczne

### Dodano

- Na dashboardzie pojawiły się 2 nowe karty:
  - podsumowanie tygodnia
  - podsumowanie miesiąca
- Karty pokazują w prosty sposób:
  - ile było treningów
  - ile było cardio
  - ile było kroków i kalorii
  - czy zmieniła się sylwetka, jeśli były wpisane pomiary
- Karty porównują też obecny tydzień i miesiąc do poprzedniego.

### Poprawiono

- Podsumowania liczą się lokalnie z danych zapisanych w aplikacji, więc nie potrzebują internetu ani konta.

---

## 2026-04-04 - Quick wins i wygoda używania

### Dodano

- W treningu można teraz wybrać datę wpisu, więc da się zapisać np. wczorajszy trening.
- Na ekranie treningu widać, czy wybrana data jest zgodna z harmonogramem, czy poza nim.

### Poprawiono

- W cardio dystans nie jest już opcjonalny. Teraz to on jest podstawą do liczenia tempa i prędkości.
- Zmieniono część nazw i tekstów, żeby były bardziej naturalne.
- "Poradnik" został przemianowany na "Encyklopedię ćwiczeń".
- W encyklopedii poprawiono układ kart ćwiczeń i usunięto zbędne ozdobniki.
- Kategorie w encyklopedii nie wymagają już przesuwania w bok, żeby zobaczyć wszystkie.
- W ustawieniach doprecyzowano opis usuwania danych, żeby było jasne, co dokładnie znika.

---

## 2026-04-04 - Stabilność, PWA i telefon

### Dodano

- Lepsze zachowanie układu na telefonie i na mniejszych ekranach.

### Poprawiono

- Naprawiono `sw.js`, czyli ważną część odpowiedzialną za działanie aplikacji jako PWA.
- Naprawiono błąd z zapisem powiadomień, przez który świeżo dodana notyfikacja mogła zostać nadpisana.
- Dashboard, Cardio i kilka innych widoków lepiej dopasowują się teraz do małych ekranów.

---

## 2026-04-03 - Szybsze wpisywanie i bezpieczeństwo danych

### Dodano

- Szybkie dodawanie cardio z dashboardu.
- Szybkie dodawanie pomiaru sylwetki z dashboardu.
- Import i eksport danych.
- Pełny backup aplikacji.
- Więcej informacji w module cardio:
  - tempo
  - prędkość
  - historia aktywności
  - tygodniowe podsumowania kroków i kalorii

### Poprawiono

- Dodano wyraźniejsze potwierdzenie przed usunięciem wszystkich danych.
- Uporządkowano ścieżki i elementy potrzebne do działania aplikacji po wdrożeniu.

---

## Wcześniej - najważniejsze etapy rozwoju

### Dodano

- Dashboard jako główny ekran aplikacji.
- Moduł treningu z planem tygodnia.
- Moduł cardio.
- Moduł sylwetki i pomiarów.
- Rest timer.
- Kalkulator 1RM.
- Profil użytkownika.
- Wykresy i statystyki.

### Poprawiono

- Aplikacja stopniowo była rozwijana tak, żeby bardziej przypominała pełne narzędzie, a nie tylko prostą stronę.
- Z czasem dodawano lepszą obsługę danych, backupów i pracy lokalnej bez backendu.

---

## Najkrócej

Na początku powstała baza: trening, cardio, sylwetka i dashboard.
Potem doszły szybkie akcje, backupy i wygodniejsze wpisywanie danych.
Następnie poprawiona została stabilność, responsywność i PWA.
Na końcu doszły prostsze teksty, lepszy UX i lokalne podsumowania tygodnia oraz miesiąca.
