# Cadı Kulübesi — Cozy İksir Pomodoro

Odaklanma süreni pomodoro ile takip et; pixel cadın bu sürede kazanı karıştırıp iksir pişirsin. Kazandığın iksirlerle yeni cadılar ve kazanlar açabilirsin.

## Nasıl çalışıyor?

1. **15, 25 veya 50 dakika** seç ve **Pişirmeye Başla**'ya bas.
2. Süre ilerlerken pixel cadı kazanı karıştırmaya başlar.
3. **Süreyi tamamlarsan** 1 tam şişe iksir kazanırsın.
4. **Erken molaya çıkarsan** şişe devrilir, yarısı dökülür ve 0.5 iksir alırsın.
5. Süreyi hiç başlatmadan bırakırsan iksir kazanmazsın.

Bu kurallar `src/lib/game.ts` içinde duruyor ve `src/test/game.test.ts` altında test ediliyor.

## İksir Dükkanı

Biriktirdiğin iksirlerle yeni cadılar ve kazanlar açabilirsin. Satın aldıkların kalıcı; istediğin zaman bunlardan birini seçip kullanabilirsin.

| Cadı           | İksir |
| -------------- | ----- |
| Adaçayı Cadısı | 0 (başlangıç) |
| Gül Cadısı     | 3     |
| Ayaz Cadısı    | 6     |
| Köz Cadısı     | 10    |
| Gölge Cadısı   | 15    |

| Kazan       | İksir |
| ----------- | ----- |
| Demir Kazan | 0 (başlangıç) |
| Pembe Kazan | 2     |
| Gök Kazan   | 5     |
| Altın Kazan | 12    |

## Yerel olarak çalıştırma

Node.js gerekiyor (ya da bun).

```sh
npm install
npm run dev
```

Testler için:

```sh
npx vitest run
```

## Teknoloji

- TanStack Start (React 19) + TypeScript
- Tailwind CSS v4
- Vitest

## Not

İksir sayın ve satın aldıkların şu an kullandığın tarayıcıda (localStorage) saklanıyor; başka bir cihazda görünmez.
