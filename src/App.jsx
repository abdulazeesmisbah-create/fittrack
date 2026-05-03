import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ─── ALL NUTRIENTS PER 100g ────────────────────────────────────────────────
   id,n(name),t(emoji),c(category),g(default serving g),
   cal,pro,carb,fat,fib,sug,sod,ca,fe,vc,vd,va,vb,k,zn,mg,cho
   Special: wheyBrand=true → shows protein-per-scoop adjuster
──────────────────────────────────────────────────────────────────────────── */
const DB = [
  // ══ 🌴 TAMIL / SOUTH INDIAN ══════════════════════════════════════════════
  {id:101,n:"Plain Dosa",t:"🌴",c:"Tamil",g:80,cal:165,pro:4.3,carb:32,fat:3.0,fib:1.5,sug:0.6,sod:263,ca:23,fe:1.0,vc:0,vd:0,va:0,vb:0,k:119,zn:0.5,mg:23,cho:0},
  {id:102,n:"Masala Dosa",t:"🌴",c:"Tamil",g:130,cal:165,pro:4.0,carb:27,fat:4.8,fib:1.9,sug:0.9,sod:292,ca:25,fe:1.1,vc:6,vd:0,va:14,vb:0,k:215,zn:0.5,mg:22,cho:0},
  {id:103,n:"Rava Dosa",t:"🌴",c:"Tamil",g:90,cal:178,pro:5.0,carb:31,fat:5.0,fib:1.1,sug:0.9,sod:267,ca:24,fe:1.0,vc:0,vd:0,va:6,vb:0,k:122,zn:0.6,mg:22,cho:0},
  {id:104,n:"Egg Dosa",t:"🌴",c:"Tamil",g:120,cal:163,pro:7.9,carb:22,fat:6.3,fib:1.0,sug:0.5,sod:233,ca:33,fe:1.2,vc:0,vd:0.9,va:63,vb:0.5,k:121,zn:0.7,mg:18,cho:117},
  {id:105,n:"Onion Dosa",t:"🌴",c:"Tamil",g:90,cal:158,pro:4.2,carb:28,fat:3.8,fib:1.6,sug:1.5,sod:241,ca:22,fe:0.9,vc:4,vd:0,va:8,vb:0,k:135,zn:0.5,mg:20,cho:0},
  {id:106,n:"Set Dosa (2 pcs)",t:"🌴",c:"Tamil",g:130,cal:152,pro:4.5,carb:28,fat:3.2,fib:1.5,sug:0.8,sod:240,ca:22,fe:1.0,vc:0,vd:0,va:0,vb:0,k:105,zn:0.5,mg:20,cho:0},
  {id:107,n:"Uttapam",t:"🌴",c:"Tamil",g:100,cal:145,pro:4.8,carb:24,fat:3.5,fib:1.8,sug:1.5,sod:270,ca:28,fe:1.0,vc:5,vd:0,va:10,vb:0,k:150,zn:0.5,mg:22,cho:0},
  {id:108,n:"Idly",t:"🌴",c:"Tamil",g:50,cal:116,pro:4.2,carb:24,fat:0.8,fib:1.0,sug:0.6,sod:260,ca:20,fe:1.0,vc:0,vd:0,va:0,vb:0,k:90,zn:0.4,mg:20,cho:0},
  {id:109,n:"Rava Idly",t:"🌴",c:"Tamil",g:60,cal:153,pro:5.0,carb:25,fat:4.2,fib:1.3,sug:0.8,sod:350,ca:30,fe:1.0,vc:0,vd:0,va:8,vb:0,k:108,zn:0.5,mg:23,cho:0},
  {id:110,n:"Medu Vada",t:"🌴",c:"Tamil",g:70,cal:169,pro:6.4,carb:20,fat:7.9,fib:2.9,sug:0.9,sod:357,ca:50,fe:1.4,vc:0,vd:0,va:7,vb:0,k:157,zn:0.9,mg:31,cho:0},
  {id:111,n:"Masala Vada",t:"🌴",c:"Tamil",g:60,cal:205,pro:7.9,carb:24,fat:9.2,fib:3.8,sug:1.5,sod:417,ca:48,fe:2.0,vc:3,vd:0,va:12,vb:0,k:197,zn:0.9,mg:35,cho:0},
  {id:112,n:"Ven Pongal",t:"🌴",c:"Tamil",g:150,cal:162,pro:4.8,carb:25,fat:5.5,fib:1.5,sug:0.6,sod:260,ca:20,fe:1.0,vc:0,vd:0,va:8,vb:0,k:100,zn:0.5,mg:22,cho:5},
  {id:113,n:"Sakkarai Pongal",t:"🌴",c:"Tamil",g:150,cal:210,pro:3.5,carb:38,fat:5.5,fib:1.0,sug:18,sod:120,ca:28,fe:0.8,vc:0,vd:0,va:8,vb:0,k:90,zn:0.3,mg:15,cho:8},
  {id:114,n:"Sambar",t:"🌴",c:"Tamil",g:150,cal:55,pro:3.2,carb:8.0,fat:1.5,fib:2.8,sug:2.0,sod:320,ca:38,fe:1.2,vc:12,vd:0,va:35,vb:0,k:220,zn:0.6,mg:28,cho:0},
  {id:115,n:"Rasam",t:"🌴",c:"Tamil",g:150,cal:13,pro:0.5,carb:2.3,fat:0.3,fib:0.3,sug:1.0,sod:187,ca:8,fe:0.3,vc:5,vd:0,va:13,vb:0,k:93,zn:0.1,mg:7,cho:0},
  {id:116,n:"Coconut Chutney",t:"🌴",c:"Tamil",g:30,cal:260,pro:3.0,carb:12,fat:23,fib:5.0,sug:3.3,sod:317,ca:27,fe:1.3,vc:3,vd:0,va:0,vb:0,k:267,zn:0.7,mg:33,cho:0},
  {id:117,n:"Tomato Chutney",t:"🌴",c:"Tamil",g:30,cal:117,pro:2.7,carb:17,fat:5.0,fib:3.3,sug:10,sod:600,ca:40,fe:1.7,vc:27,vd:0,va:100,vb:0,k:367,zn:0.7,mg:27,cho:0},
  {id:118,n:"Curd Rice",t:"🌴",c:"Tamil",g:150,cal:112,pro:3.5,carb:18,fat:3.0,fib:0.3,sug:2.0,sod:180,ca:95,fe:0.3,vc:1,vd:0.1,va:18,vb:0.2,k:130,zn:0.4,mg:12,cho:8},
  {id:119,n:"Tomato Rice",t:"🌴",c:"Tamil",g:150,cal:155,pro:3.5,carb:28,fat:4.2,fib:1.5,sug:3.5,sod:310,ca:22,fe:1.2,vc:12,vd:0,va:65,vb:0,k:195,zn:0.5,mg:18,cho:0},
  {id:120,n:"Lemon Rice",t:"🌴",c:"Tamil",g:150,cal:148,pro:3.2,carb:27,fat:4.0,fib:1.0,sug:0.8,sod:260,ca:18,fe:1.0,vc:8,vd:0,va:10,vb:0,k:155,zn:0.5,mg:16,cho:0},
  {id:121,n:"Tamarind Rice",t:"🌴",c:"Tamil",g:150,cal:155,pro:3.0,carb:28,fat:4.5,fib:1.5,sug:2.5,sod:380,ca:22,fe:1.5,vc:2,vd:0,va:18,vb:0,k:180,zn:0.5,mg:18,cho:0},
  {id:122,n:"Coconut Rice",t:"🌴",c:"Tamil",g:150,cal:168,pro:3.0,carb:26,fat:6.5,fib:1.5,sug:0.5,sod:180,ca:15,fe:0.8,vc:0,vd:0,va:0,vb:0,k:105,zn:0.4,mg:14,cho:0},
  {id:123,n:"Ghee Rice",t:"🌴",c:"Tamil",g:150,cal:185,pro:3.2,carb:29,fat:7.0,fib:0.5,sug:0.3,sod:195,ca:12,fe:0.6,vc:0,vd:0.1,va:8,vb:0,k:68,zn:0.5,mg:14,cho:15},
  {id:124,n:"Jeera Rice",t:"🌴",c:"Tamil",g:150,cal:168,pro:3.5,carb:30,fat:4.5,fib:0.8,sug:0.3,sod:220,ca:14,fe:1.0,vc:0,vd:0,va:5,vb:0,k:80,zn:0.5,mg:15,cho:5},
  {id:125,n:"Avial",t:"🌴",c:"Tamil",g:100,cal:95,pro:2.5,carb:10,fat:5.0,fib:3.0,sug:3.5,sod:220,ca:32,fe:0.8,vc:12,vd:0,va:120,vb:0,k:280,zn:0.4,mg:22,cho:0},
  {id:126,n:"Kootu",t:"🌴",c:"Tamil",g:100,cal:88,pro:4.0,carb:12,fat:3.0,fib:3.5,sug:2.0,sod:280,ca:45,fe:1.5,vc:5,vd:0,va:40,vb:0,k:220,zn:0.6,mg:28,cho:0},
  {id:127,n:"Keerai Masiyal",t:"🌴",c:"Tamil",g:100,cal:68,pro:4.5,carb:6.5,fat:2.0,fib:2.5,sug:1.0,sod:240,ca:150,fe:3.5,vc:20,vd:0,va:320,vb:0,k:380,zn:0.8,mg:55,cho:0},
  {id:128,n:"Adai",t:"🌴",c:"Tamil",g:100,cal:168,pro:8.5,carb:26,fat:3.5,fib:3.5,sug:1.0,sod:245,ca:45,fe:2.0,vc:0,vd:0,va:10,vb:0,k:185,zn:0.9,mg:35,cho:0},
  {id:129,n:"Appam",t:"🌴",c:"Tamil",g:70,cal:117,pro:2.6,carb:23,fat:2.1,fib:0.7,sug:0.7,sod:136,ca:11,fe:0.7,vc:0,vd:0,va:0,vb:0,k:79,zn:0.4,mg:14,cho:0},
  {id:130,n:"Idiyappam",t:"🌴",c:"Tamil",g:100,cal:160,pro:3.0,carb:34,fat:0.8,fib:0.8,sug:0.5,sod:95,ca:10,fe:1.0,vc:0,vd:0,va:0,vb:0,k:75,zn:0.3,mg:18,cho:0},
  {id:131,n:"Parotta",t:"🌴",c:"Tamil",g:100,cal:326,pro:7.5,carb:50,fat:12,fib:1.9,sug:1.3,sod:475,ca:37,fe:2.3,vc:0,vd:0,va:0,vb:0,k:119,zn:0.8,mg:25,cho:6},
  {id:132,n:"Kuzhi Paniyaram",t:"🌴",c:"Tamil",g:100,cal:155,pro:4.5,carb:26,fat:4.0,fib:1.2,sug:0.8,sod:280,ca:22,fe:1.0,vc:0,vd:0,va:5,vb:0,k:100,zn:0.4,mg:18,cho:0},
  {id:133,n:"Chicken Chettinad",t:"🌴",c:"Tamil",g:100,cal:175,pro:18,carb:5.0,fat:9.5,fib:1.0,sug:2.0,sod:480,ca:28,fe:1.5,vc:4,vd:0.2,va:55,vb:0.4,k:320,zn:1.2,mg:22,cho:68},
  {id:134,n:"Fish Curry (Meen Kuzhambu)",t:"🌴",c:"Tamil",g:100,cal:120,pro:14,carb:5.5,fat:5.0,fib:1.0,sug:2.5,sod:420,ca:38,fe:1.2,vc:8,vd:1.5,va:45,vb:1.0,k:290,zn:0.8,mg:25,cho:45},
  {id:135,n:"Egg Curry",t:"🌴",c:"Tamil",g:100,cal:148,pro:9.5,carb:5.5,fat:10,fib:0.8,sug:2.5,sod:380,ca:55,fe:1.5,vc:4,vd:0.5,va:80,vb:0.6,k:220,zn:0.9,mg:18,cho:180},
  {id:136,n:"Prawn Masala",t:"🌴",c:"Tamil",g:100,cal:135,pro:16,carb:5.0,fat:6.0,fib:0.8,sug:2.0,sod:480,ca:55,fe:1.5,vc:5,vd:0.5,va:45,vb:1.2,k:310,zn:1.5,mg:28,cho:110},
  {id:137,n:"Murukku",t:"🌴",c:"Tamil",g:30,cal:493,pro:11.7,carb:73,fat:18,fib:5.0,sug:1.7,sod:817,ca:60,fe:4.0,vc:0,vd:0,va:0,vb:0,k:267,zn:1.7,mg:60,cho:0},
  {id:138,n:"Payasam",t:"🌴",c:"Tamil",g:150,cal:178,pro:3.5,carb:32,fat:5.0,fib:0.5,sug:22,sod:85,ca:90,fe:0.4,vc:0,vd:0.2,va:35,vb:0.3,k:145,zn:0.4,mg:12,cho:15},
  {id:139,n:"Puttu",t:"🌴",c:"Tamil",g:100,cal:165,pro:3.5,carb:34,fat:1.5,fib:1.5,sug:0.5,sod:180,ca:12,fe:1.5,vc:0,vd:0,va:0,vb:0,k:95,zn:0.5,mg:22,cho:0},
  {id:140,n:"Kadala Curry",t:"🌴",c:"Tamil",g:100,cal:142,pro:8.0,carb:22,fat:3.5,fib:7.0,sug:2.0,sod:310,ca:50,fe:2.5,vc:4,vd:0,va:18,vb:0,k:380,zn:1.2,mg:45,cho:0},

  // ══ 🇮🇳 NORTH INDIAN ══════════════════════════════════════════════════════
  {id:201,n:"Chapati / Roti",t:"🇮🇳",c:"N.Indian",g:40,cal:300,pro:8.8,carb:55,fat:6.3,fib:5.0,sug:1.0,sod:263,ca:40,fe:2.5,vc:0,vd:0,va:0,vb:0,k:225,zn:1.3,mg:50,cho:0},
  {id:202,n:"Aloo Paratha",t:"🇮🇳",c:"N.Indian",g:120,cal:260,pro:5.5,carb:38,fat:10,fib:3.0,sug:1.0,sod:310,ca:30,fe:1.6,vc:6,vd:0,va:12,vb:0,k:320,zn:0.7,mg:28,cho:0},
  {id:203,n:"Paneer Paratha",t:"🇮🇳",c:"N.Indian",g:130,cal:290,pro:10,carb:36,fat:12,fib:2.5,sug:1.2,sod:330,ca:180,fe:1.2,vc:2,vd:0.2,va:60,vb:0.4,k:210,zn:1.0,mg:30,cho:18},
  {id:204,n:"Dal Tadka",t:"🇮🇳",c:"N.Indian",g:150,cal:116,pro:9.0,carb:20,fat:0.9,fib:5.0,sug:1.5,sod:280,ca:42,fe:2.2,vc:4,vd:0,va:20,vb:0,k:370,zn:1.2,mg:38,cho:0},
  {id:205,n:"Dal Makhani",t:"🇮🇳",c:"N.Indian",g:150,cal:155,pro:8.5,carb:18,fat:6.5,fib:5.5,sug:1.8,sod:360,ca:68,fe:2.5,vc:3,vd:0,va:55,vb:0,k:390,zn:1.0,mg:42,cho:8},
  {id:206,n:"Butter Chicken",t:"🇮🇳",c:"N.Indian",g:150,cal:150,pro:15,carb:7.0,fat:7.5,fib:0.8,sug:3.5,sod:410,ca:28,fe:0.9,vc:5,vd:0.2,va:85,vb:0.3,k:290,zn:0.8,mg:18,cho:58},
  {id:207,n:"Paneer Butter Masala",t:"🇮🇳",c:"N.Indian",g:150,cal:180,pro:8.5,carb:8.0,fat:13,fib:1.0,sug:4.0,sod:380,ca:160,fe:0.8,vc:6,vd:0.2,va:90,vb:0.3,k:210,zn:1.0,mg:20,cho:32},
  {id:208,n:"Palak Paneer",t:"🇮🇳",c:"N.Indian",g:150,cal:168,pro:8.0,carb:6.5,fat:12,fib:2.5,sug:1.5,sod:290,ca:220,fe:3.5,vc:14,vd:0.2,va:420,vb:0.2,k:310,zn:1.2,mg:35,cho:28},
  {id:209,n:"Chole",t:"🇮🇳",c:"N.Indian",g:150,cal:164,pro:9.0,carb:27,fat:3.5,fib:7.5,sug:2.5,sod:350,ca:57,fe:2.8,vc:3,vd:0,va:10,vb:0,k:440,zn:1.4,mg:50,cho:0},
  {id:210,n:"Rajma",t:"🇮🇳",c:"N.Indian",g:150,cal:127,pro:8.7,carb:22,fat:0.5,fib:6.4,sug:0.3,sod:240,ca:50,fe:2.5,vc:2,vd:0,va:0,vb:0,k:403,zn:1.4,mg:45,cho:0},
  {id:211,n:"Chicken Biryani",t:"🇮🇳",c:"N.Indian",g:200,cal:190,pro:10,carb:24,fat:5.5,fib:0.8,sug:1.0,sod:340,ca:23,fe:1.0,vc:2,vd:0.2,va:30,vb:0.2,k:190,zn:0.8,mg:20,cho:38},
  {id:212,n:"Veg Biryani",t:"🇮🇳",c:"N.Indian",g:200,cal:140,pro:3.5,carb:26,fat:3.2,fib:1.2,sug:1.2,sod:230,ca:20,fe:0.9,vc:3,vd:0,va:28,vb:0,k:145,zn:0.4,mg:16,cho:0},
  {id:213,n:"Naan",t:"🇮🇳",c:"N.Indian",g:90,cal:291,pro:9.4,carb:50,fat:6.1,fib:2.0,sug:2.8,sod:556,ca:80,fe:2.4,vc:0,vd:0,va:0,vb:0,k:111,zn:0.9,mg:24,cho:6},
  {id:214,n:"Samosa",t:"🇮🇳",c:"N.Indian",g:100,cal:262,pro:4.5,carb:33,fat:13,fib:3.3,sug:2.5,sod:517,ca:30,fe:1.7,vc:8,vd:0,va:20,vb:0,k:275,zn:0.5,mg:22,cho:0},
  {id:215,n:"Poha",t:"🇮🇳",c:"N.Indian",g:150,cal:130,pro:2.5,carb:28,fat:0.9,fib:0.6,sug:0.5,sod:180,ca:12,fe:1.8,vc:5,vd:0,va:8,vb:0,k:80,zn:0.5,mg:18,cho:0},
  {id:216,n:"Upma",t:"🇮🇳",c:"N.Indian",g:150,cal:148,pro:4.0,carb:26,fat:4.0,fib:1.8,sug:0.8,sod:240,ca:18,fe:1.2,vc:3,vd:0,va:12,vb:0,k:120,zn:0.6,mg:22,cho:0},
  {id:217,n:"Khichdi",t:"🇮🇳",c:"N.Indian",g:150,cal:98,pro:4.5,carb:17,fat:1.5,fib:2.5,sug:0.8,sod:180,ca:28,fe:1.5,vc:2,vd:0,va:18,vb:0,k:160,zn:0.7,mg:28,cho:0},
  {id:218,n:"Pav Bhaji",t:"🇮🇳",c:"N.Indian",g:250,cal:155,pro:3.8,carb:26,fat:4.5,fib:2.3,sug:3.0,sod:290,ca:28,fe:1.0,vc:9,vd:0,va:40,vb:0,k:210,zn:0.5,mg:18,cho:8},
  {id:219,n:"Gulab Jamun (1 pc)",t:"🇮🇳",c:"N.Indian",g:50,cal:250,pro:4.7,carb:40,fat:9.2,fib:0.3,sug:30,sod:158,ca:103,fe:0.7,vc:0,vd:0,va:37,vb:0.1,k:142,zn:0.5,mg:17,cho:30},

  // ══ 🍞 BREAD & BAKERY ════════════════════════════════════════════════════
  {id:301,n:"White Bread",t:"🍞",c:"Bread",g:30,cal:265,pro:9.0,carb:51,fat:3.3,fib:2.7,sug:5.0,sod:490,ca:133,fe:3.0,vc:0,vd:0,va:0,vb:0,k:107,zn:0.9,mg:27,cho:0},
  {id:302,n:"Whole Wheat Bread",t:"🍞",c:"Bread",g:30,cal:247,pro:13,carb:41,fat:3.4,fib:7.0,sug:6.0,sod:400,ca:107,fe:3.7,vc:0,vd:0,va:0,vb:0,k:248,zn:2.3,mg:76,cho:0},
  {id:303,n:"Multigrain Bread",t:"🍞",c:"Bread",g:30,cal:240,pro:10,carb:43,fat:3.5,fib:6.0,sug:5.0,sod:430,ca:90,fe:2.8,vc:0,vd:0,va:0,vb:0,k:200,zn:1.8,mg:60,cho:0},
  {id:304,n:"Brown Bread",t:"🍞",c:"Bread",g:30,cal:252,pro:10,carb:48,fat:3.0,fib:4.5,sug:4.5,sod:460,ca:85,fe:2.5,vc:0,vd:0,va:0,vb:0,k:200,zn:1.5,mg:52,cho:0},
  {id:305,n:"Sourdough Bread",t:"🍞",c:"Bread",g:56,cal:187,pro:8.0,carb:36,fat:1.3,fib:2.1,sug:1.3,sod:467,ca:30,fe:2.4,vc:0,vd:0,va:0,vb:0,k:100,zn:0.8,mg:23,cho:0},
  {id:306,n:"Pav / Dinner Roll",t:"🍞",c:"Bread",g:55,cal:145,pro:5.0,carb:28,fat:2.0,fib:1.2,sug:2.5,sod:290,ca:40,fe:1.5,vc:0,vd:0,va:0,vb:0,k:65,zn:0.5,mg:15,cho:0},
  {id:307,n:"Pita Bread",t:"🍞",c:"Bread",g:60,cal:275,pro:9.1,carb:55,fat:1.2,fib:2.2,sug:0.5,sod:536,ca:86,fe:2.3,vc:0,vd:0,va:0,vb:0,k:120,zn:0.9,mg:27,cho:0},
  {id:308,n:"Garlic Bread",t:"🍞",c:"Bread",g:35,cal:350,pro:7.5,carb:42,fat:17,fib:1.5,sug:2.0,sod:600,ca:60,fe:2.0,vc:1,vd:0,va:20,vb:0,k:110,zn:0.6,mg:18,cho:15},
  {id:309,n:"Bagel (plain)",t:"🍞",c:"Bread",g:98,cal:270,pro:10,carb:53,fat:1.5,fib:2.3,sug:5.0,sod:449,ca:13,fe:2.7,vc:0,vd:0,va:0,vb:0,k:88,zn:0.8,mg:25,cho:0},
  {id:310,n:"Rusk / Toast Biscuit",t:"🍞",c:"Bread",g:20,cal:407,pro:11,carb:76,fat:5.8,fib:2.5,sug:18,sod:360,ca:35,fe:2.5,vc:0,vd:0,va:0,vb:0,k:130,zn:0.7,mg:22,cho:10},
  {id:311,n:"Khari Biscuit",t:"🍞",c:"Bread",g:20,cal:467,pro:8.3,carb:58,fat:23,fib:1.7,sug:5.0,sod:533,ca:20,fe:2.0,vc:0,vd:0,va:0,vb:0,k:90,zn:0.5,mg:15,cho:25},

  // ══ 🥚 EGGS ══════════════════════════════════════════════════════════════
  {id:401,n:"Boiled Egg (1)",t:"🥚",c:"Eggs",g:55,cal:155,pro:12.6,carb:1.1,fat:10.6,fib:0,sug:0.6,sod:124,ca:50,fe:1.8,vc:0,vd:2.2,va:149,vb:1.1,k:126,zn:1.0,mg:10,cho:373},
  {id:402,n:"Fried Egg – Sunny Side (1)",t:"🥚",c:"Eggs",g:46,cal:196,pro:13.6,carb:0.9,fat:14.8,fib:0,sug:0.4,sod:207,ca:58,fe:1.9,vc:0,vd:2.4,va:162,vb:1.1,k:148,zn:1.1,mg:11,cho:401},
  {id:403,n:"Fried Egg – Both Sides (1)",t:"🥚",c:"Eggs",g:46,cal:185,pro:13.8,carb:0.5,fat:14,fib:0,sug:0.3,sod:210,ca:52,fe:1.8,vc:0,vd:2.2,va:158,vb:1.1,k:140,zn:1.1,mg:10,cho:380},
  {id:404,n:"Half-Boiled Egg (1)",t:"🥚",c:"Eggs",g:55,cal:143,pro:12.6,carb:0.7,fat:9.5,fib:0,sug:0.4,sod:124,ca:50,fe:1.7,vc:0,vd:2.0,va:149,vb:1.0,k:126,zn:1.0,mg:10,cho:373},
  {id:405,n:"Poached Egg (1)",t:"🥚",c:"Eggs",g:55,cal:143,pro:12.5,carb:0.7,fat:9.5,fib:0,sug:0.4,sod:294,ca:53,fe:1.7,vc:0,vd:2.0,va:140,vb:1.0,k:132,zn:1.0,mg:10,cho:370},
  {id:406,n:"Scrambled Eggs (2)",t:"🥚",c:"Eggs",g:100,cal:149,pro:10,carb:1.6,fat:11,fib:0,sug:1.6,sod:247,ca:57,fe:1.2,vc:0,vd:1.8,va:140,vb:0.8,k:132,zn:0.9,mg:12,cho:316},
  {id:407,n:"Omelette Plain (2 eggs)",t:"🥚",c:"Eggs",g:100,cal:154,pro:10.6,carb:0.4,fat:12,fib:0,sug:0.4,sod:342,ca:53,fe:1.5,vc:0,vd:2.2,va:155,vb:1.0,k:138,zn:1.0,mg:11,cho:391},
  {id:408,n:"Masala Omelette (2 eggs)",t:"🥚",c:"Eggs",g:120,cal:158,pro:9.8,carb:3.8,fat:11.5,fib:0.7,sug:1.8,sod:380,ca:56,fe:1.6,vc:7,vd:2.0,va:155,vb:0.9,k:198,zn:1.0,mg:13,cho:358},
  {id:409,n:"Egg Bhurji (2 eggs)",t:"🥚",c:"Eggs",g:120,cal:188,pro:11,carb:4.6,fat:13,fib:0.8,sug:2.1,sod:342,ca:54,fe:1.7,vc:8,vd:1.7,va:138,vb:0.8,k:167,zn:1.0,mg:13,cho:333},
  {id:410,n:"Egg White (1 large)",t:"🥚",c:"Eggs",g:33,cal:52,pro:10.9,carb:0.7,fat:0.2,fib:0,sug:0.6,sod:166,ca:7,fe:0.1,vc:0,vd:0,va:0,vb:0,k:163,zn:0.03,mg:11,cho:0},
  {id:411,n:"Egg Yolk (1 large)",t:"🥚",c:"Eggs",g:17,cal:322,pro:15.9,carb:3.6,fat:26.5,fib:0,sug:0.6,sod:48,ca:129,fe:2.7,vc:0,vd:5.4,va:381,vb:2.5,k:109,zn:2.3,mg:5,cho:1085},
  {id:412,n:"Egg White Omelette (2)",t:"🥚",c:"Eggs",g:66,cal:52,pro:10.9,carb:0.7,fat:0.2,fib:0,sug:0.6,sod:166,ca:7,fe:0.1,vc:0,vd:0,va:0,vb:0,k:163,zn:0.03,mg:11,cho:0},

  // ══ 🥛 MILK & DAIRY ══════════════════════════════════════════════════════
  {id:501,n:"Whole Milk",t:"🥛",c:"Dairy",g:240,cal:61,pro:3.2,carb:4.8,fat:3.3,fib:0,sug:5.0,sod:43,ca:113,fe:0.03,vc:0,vd:1.3,va:46,vb:0.4,k:132,zn:0.4,mg:10,cho:10},
  {id:502,n:"Toned Milk",t:"🥛",c:"Dairy",g:240,cal:50,pro:3.5,carb:5.0,fat:1.5,fib:0,sug:5.0,sod:40,ca:118,fe:0.02,vc:0,vd:0.8,va:35,vb:0.5,k:145,zn:0.3,mg:9,cho:6},
  {id:503,n:"Skim Milk",t:"🥛",c:"Dairy",g:240,cal:35,pro:3.4,carb:5.0,fat:0.1,fib:0,sug:5.0,sod:43,ca:125,fe:0.03,vc:0.1,vd:1.2,va:62,vb:0.5,k:159,zn:0.4,mg:11,cho:2},
  {id:504,n:"Buffalo Milk",t:"🥛",c:"Dairy",g:240,cal:98,pro:3.8,carb:5.4,fat:6.7,fib:0,sug:5.4,sod:48,ca:172,fe:0.1,vc:0,vd:0.2,va:37,vb:0.3,k:149,zn:0.5,mg:13,cho:19},
  {id:505,n:"Indian Curd / Dahi",t:"🥛",c:"Dairy",g:150,cal:61,pro:3.5,carb:4.7,fat:3.3,fib:0,sug:4.5,sod:36,ca:120,fe:0.1,vc:0.5,vd:0.1,va:27,vb:0.4,k:155,zn:0.5,mg:12,cho:13},
  {id:506,n:"Greek Yogurt",t:"🥛",c:"Dairy",g:150,cal:59,pro:10,carb:3.6,fat:0.4,fib:0,sug:3.2,sod:36,ca:110,fe:0.07,vc:0,vd:0,va:8,vb:0.7,k:141,zn:0.5,mg:11,cho:5},
  {id:507,n:"Paneer",t:"🥛",c:"Dairy",g:100,cal:296,pro:18,carb:3.0,fat:23,fib:0,sug:1.5,sod:42,ca:480,fe:0.2,vc:0,vd:0.3,va:125,vb:0.4,k:90,zn:2.4,mg:14,cho:70},
  {id:508,n:"Ghee",t:"🥛",c:"Dairy",g:14,cal:900,pro:0,carb:0,fat:100,fib:0,sug:0,sod:0,ca:0,fe:0,vc:0,vd:0.1,va:0,vb:0,k:7,zn:0,mg:0,cho:256},
  {id:509,n:"Butter",t:"🥛",c:"Dairy",g:14,cal:717,pro:0.9,carb:0.1,fat:81,fib:0,sug:0.1,sod:643,ca:24,fe:0.02,vc:0,vd:0.2,va:684,vb:0.2,k:24,zn:0.09,mg:2,cho:215},
  {id:510,n:"Lassi (Sweet)",t:"🥛",c:"Dairy",g:240,cal:75,pro:2.3,carb:11.7,fat:1.9,fib:0,sug:10,sod:40,ca:79,fe:0.04,vc:0.2,vd:0.1,va:19,vb:0.2,k:117,zn:0.3,mg:8,cho:8},
  {id:511,n:"Chaas / Buttermilk",t:"🥛",c:"Dairy",g:240,cal:41,pro:3.4,carb:5.0,fat:0.9,fib:0,sug:5.0,sod:107,ca:116,fe:0.04,vc:0.1,vd:0.1,va:7,vb:0.5,k:154,zn:0.4,mg:10,cho:4},
  {id:512,n:"Kheer",t:"🥛",c:"Dairy",g:150,cal:162,pro:4.0,carb:26,fat:5.0,fib:0.2,sug:18,sod:65,ca:120,fe:0.4,vc:0.5,vd:0.5,va:45,vb:0.4,k:150,zn:0.5,mg:12,cho:20},
  {id:513,n:"Cheese Slice (processed)",t:"🥛",c:"Dairy",g:20,cal:371,pro:22,carb:2.1,fat:30,fib:0,sug:2.1,sod:1242,ca:623,fe:0.2,vc:0,vd:0.6,va:238,vb:0.8,k:93,zn:2.7,mg:20,cho:93},
  {id:514,n:"Cream (fresh)",t:"🥛",c:"Dairy",g:30,cal:340,pro:2.1,carb:2.8,fat:36,fib:0,sug:2.8,sod:38,ca:65,fe:0.03,vc:0.2,vd:0.3,va:300,vb:0.1,k:90,zn:0.2,mg:7,cho:105},

  // ══ 🥜 NUTS & PEANUT BUTTER ══════════════════════════════════════════════
  {id:601,n:"Peanut Butter (Creamy)",t:"🥜",c:"Nuts",g:32,cal:588,pro:25,carb:20,fat:50,fib:6.0,sug:9.0,sod:459,ca:49,fe:1.9,vc:0,vd:0,va:0,vb:0,k:558,zn:2.9,mg:168,cho:0},
  {id:602,n:"Natural Peanut Butter",t:"🥜",c:"Nuts",g:32,cal:597,pro:25,carb:20,fat:51,fib:5.0,sug:4.7,sod:16,ca:43,fe:1.9,vc:0,vd:0,va:0,vb:0,k:558,zn:2.8,mg:168,cho:0},
  {id:603,n:"Almonds",t:"🥜",c:"Nuts",g:30,cal:579,pro:21,carb:22,fat:50,fib:12.5,sug:4.4,sod:1,ca:264,fe:3.7,vc:0,vd:0,va:0,vb:0,k:733,zn:3.1,mg:270,cho:0},
  {id:604,n:"Cashews",t:"🥜",c:"Nuts",g:30,cal:553,pro:18,carb:30,fat:44,fib:3.3,sug:5.9,sod:12,ca:37,fe:6.7,vc:0.5,vd:0,va:0,vb:0,k:660,zn:5.8,mg:292,cho:0},
  {id:605,n:"Walnuts",t:"🥜",c:"Nuts",g:30,cal:654,pro:15,carb:14,fat:65,fib:6.7,sug:2.6,sod:2,ca:98,fe:2.9,vc:1.3,vd:0,va:1,vb:0,k:441,zn:3.1,mg:158,cho:0},
  {id:606,n:"Pistachios",t:"🥜",c:"Nuts",g:30,cal:560,pro:20,carb:28,fat:45,fib:10.3,sug:7.7,sod:1,ca:105,fe:3.9,vc:5.6,vd:0,va:26,vb:0,k:1025,zn:2.2,mg:121,cho:0},
  {id:607,n:"Roasted Peanuts",t:"🥜",c:"Nuts",g:30,cal:585,pro:23.7,carb:21.5,fat:49.7,fib:8.0,sug:3.6,sod:383,ca:54,fe:2.3,vc:0,vd:0,va:0,vb:0,k:658,zn:3.3,mg:168,cho:0},
  {id:608,n:"Groundnut Chikki",t:"🥜",c:"Nuts",g:30,cal:493,pro:16,carb:60,fat:25,fib:5.0,sug:40,sod:83,ca:93,fe:2.7,vc:0,vd:0,va:0,vb:0,k:367,zn:2.0,mg:110,cho:0},

  // ══ 🍗 MEAT & FISH ═══════════════════════════════════════════════════════
  {id:701,n:"Chicken Breast",t:"🍗",c:"Meat",g:100,cal:165,pro:31,carb:0,fat:3.6,fib:0,sug:0,sod:74,ca:15,fe:1.0,vc:0,vd:0.1,va:10,vb:0.3,k:256,zn:1.0,mg:29,cho:85},
  {id:702,n:"Chicken Thigh",t:"🍗",c:"Meat",g:100,cal:209,pro:26,carb:0,fat:11,fib:0,sug:0,sod:76,ca:11,fe:1.3,vc:0,vd:0.2,va:25,vb:0.4,k:220,zn:2.1,mg:24,cho:93},
  {id:703,n:"Nattu Kozhi (Country Chicken)",t:"🍗",c:"Meat",g:100,cal:180,pro:22,carb:0,fat:10,fib:0,sug:0,sod:85,ca:18,fe:1.5,vc:0,vd:0.2,va:20,vb:0.4,k:280,zn:2.0,mg:25,cho:90},
  {id:704,n:"Mutton / Lamb",t:"🍗",c:"Meat",g:100,cal:258,pro:25,carb:0,fat:17,fib:0,sug:0,sod:72,ca:18,fe:2.2,vc:0,vd:0,va:18,vb:2.2,k:280,zn:4.5,mg:22,cho:97},
  {id:705,n:"Salmon",t:"🍗",c:"Meat",g:100,cal:208,pro:20,carb:0,fat:13,fib:0,sug:0,sod:59,ca:12,fe:0.3,vc:3.9,vd:13,va:35,vb:3.2,k:363,zn:0.6,mg:27,cho:63},
  {id:706,n:"Tuna (canned in water)",t:"🍗",c:"Meat",g:85,cal:116,pro:25.5,carb:0,fat:0.6,fib:0,sug:0,sod:376,ca:14,fe:1.5,vc:0,vd:1.9,va:17,vb:2.9,k:315,zn:0.8,mg:26,cho:36},
  {id:707,n:"Prawns / Shrimp",t:"🍗",c:"Meat",g:100,cal:85,pro:18,carb:0.9,fat:0.9,fib:0,sug:0,sod:111,ca:52,fe:0.5,vc:0,vd:0.4,va:18,vb:1.5,k:185,zn:1.1,mg:37,cho:152},

  // ══ 🌾 GRAINS & RICE ══════════════════════════════════════════════════════
  {id:801,n:"White Rice (cooked)",t:"🌾",c:"Grains",g:150,cal:130,pro:2.7,carb:28,fat:0.3,fib:0.4,sug:0,sod:1,ca:10,fe:0.2,vc:0,vd:0,va:0,vb:0,k:35,zn:0.5,mg:12,cho:0},
  {id:802,n:"Brown Rice (cooked)",t:"🌾",c:"Grains",g:150,cal:216,pro:5.0,carb:45,fat:1.8,fib:3.5,sug:0.7,sod:10,ca:20,fe:0.8,vc:0,vd:0,va:0,vb:0,k:154,zn:1.2,mg:43,cho:0},
  {id:803,n:"Ragi / Finger Millet (flour)",t:"🌾",c:"Grains",g:100,cal:336,pro:7.3,carb:72,fat:1.5,fib:3.6,sug:0.5,sod:11,ca:344,fe:3.9,vc:0,vd:0,va:0,vb:0,k:408,zn:2.3,mg:137,cho:0},
  {id:804,n:"Ragi Mudde (1 ball)",t:"🌾",c:"Grains",g:120,cal:280,pro:6.1,carb:60,fat:1.3,fib:3.0,sug:0.4,sod:9,ca:288,fe:3.3,vc:0,vd:0,va:0,vb:0,k:341,zn:1.9,mg:115,cho:0},
  {id:805,n:"Whole Wheat Atta (dry)",t:"🌾",c:"Grains",g:100,cal:340,pro:12,carb:71,fat:1.5,fib:12,sug:0.5,sod:3,ca:34,fe:3.9,vc:0,vd:0,va:0,vb:0,k:405,zn:2.6,mg:138,cho:0},
  {id:806,n:"Quinoa (cooked)",t:"🌾",c:"Grains",g:150,cal:120,pro:4.4,carb:21,fat:1.9,fib:2.8,sug:0.9,sod:7,ca:17,fe:1.5,vc:0,vd:0,va:3,vb:0,k:172,zn:1.1,mg:64,cho:0},
  {id:807,n:"Broken Wheat / Dalia",t:"🌾",c:"Grains",g:100,cal:342,pro:11,carb:72,fat:1.6,fib:9.0,sug:0.5,sod:5,ca:30,fe:3.0,vc:0,vd:0,va:0,vb:0,k:350,zn:2.3,mg:120,cho:0},
  {id:808,n:"Corn Flakes (plain)",t:"🌾",c:"Grains",g:30,cal:357,pro:7.5,carb:84,fat:0.4,fib:2.0,sug:7.5,sod:1000,ca:3,fe:8.3,vc:21,vd:1.8,va:0,vb:1.5,k:100,zn:0.3,mg:11,cho:0},
  {id:809,n:"Pasta (cooked)",t:"🌾",c:"Grains",g:180,cal:158,pro:5.8,carb:31,fat:0.9,fib:1.8,sug:0.6,sod:1,ca:7,fe:1.3,vc:0,vd:0,va:0,vb:0,k:44,zn:0.5,mg:18,cho:0},
  {id:810,n:"Vermicelli / Semiya (cooked)",t:"🌾",c:"Grains",g:150,cal:138,pro:4.0,carb:28,fat:0.5,fib:0.5,sug:0.3,sod:5,ca:8,fe:0.8,vc:0,vd:0,va:0,vb:0,k:42,zn:0.4,mg:15,cho:0},
  {id:811,n:"Millet / Bajra (cooked)",t:"🌾",c:"Grains",g:150,cal:119,pro:3.5,carb:23,fat:1.0,fib:2.5,sug:0.4,sod:5,ca:8,fe:0.8,vc:0,vd:0,va:0,vb:0,k:62,zn:0.8,mg:44,cho:0},
  {id:812,n:"Wheat Germ",t:"🌾",c:"Grains",g:28,cal:360,pro:23,carb:52,fat:9.5,fib:13,sug:6.0,sod:12,ca:39,fe:6.3,vc:0,vd:0,va:0,vb:0,k:892,zn:12.3,mg:239,cho:0},

  // ══ 🥣 BRAND OATS ════════════════════════════════════════════════════════
  {id:850,n:"Quaker Oats (Old Fashioned)",t:"🥣",c:"Oats",g:40,cal:379,pro:13.4,carb:68,fat:6.5,fib:9.4,sug:0.5,sod:0,ca:42,fe:3.6,vc:0,vd:0,va:0,vb:0,k:362,zn:2.7,mg:138,cho:0},
  {id:851,n:"Quaker Instant Oats",t:"🥣",c:"Oats",g:28,cal:350,pro:12.5,carb:67,fat:5.0,fib:9.0,sug:1.0,sod:80,ca:35,fe:3.5,vc:0,vd:0,va:0,vb:0,k:300,zn:2.5,mg:120,cho:0},
  {id:852,n:"Quaker Oats with Milk Powder",t:"🥣",c:"Oats",g:40,cal:390,pro:14,carb:68,fat:7.0,fib:8.5,sug:5.0,sod:160,ca:200,fe:4.0,vc:10,vd:2.0,va:100,vb:0.5,k:350,zn:2.8,mg:128,cho:5},
  {id:853,n:"Saffola Oats (Plain)",t:"🥣",c:"Oats",g:40,cal:375,pro:13,carb:66,fat:7.0,fib:8.5,sug:0.5,sod:10,ca:40,fe:4.0,vc:0,vd:0,va:0,vb:0,k:320,zn:2.5,mg:125,cho:0},
  {id:854,n:"Saffola Oats Masala",t:"🥣",c:"Oats",g:40,cal:360,pro:12,carb:66,fat:6.5,fib:7.5,sug:1.5,sod:450,ca:35,fe:3.8,vc:5,vd:0,va:15,vb:0,k:290,zn:2.2,mg:115,cho:0},
  {id:855,n:"Kellogg's Oats",t:"🥣",c:"Oats",g:40,cal:356,pro:11,carb:65,fat:7.0,fib:8.0,sug:0.8,sod:0,ca:38,fe:3.5,vc:0,vd:0,va:0,vb:0,k:310,zn:2.4,mg:120,cho:0},
  {id:856,n:"Bagrry's White Oats",t:"🥣",c:"Oats",g:40,cal:370,pro:12.5,carb:67,fat:6.8,fib:8.8,sug:0.5,sod:5,ca:40,fe:3.7,vc:0,vd:0,va:0,vb:0,k:335,zn:2.6,mg:130,cho:0},
  {id:857,n:"Yogabar Oats (Masala)",t:"🥣",c:"Oats",g:40,cal:355,pro:11.5,carb:64,fat:6.8,fib:8.0,sug:1.2,sod:480,ca:38,fe:3.6,vc:5,vd:0,va:12,vb:0,k:295,zn:2.3,mg:118,cho:0},
  {id:858,n:"Bob's Red Mill Rolled Oats",t:"🥣",c:"Oats",g:40,cal:380,pro:13,carb:68,fat:6.5,fib:9.6,sug:0.5,sod:0,ca:42,fe:3.8,vc:0,vd:0,va:0,vb:0,k:370,zn:2.8,mg:140,cho:0},
  {id:859,n:"Oatmeal (cooked with water)",t:"🥣",c:"Oats",g:240,cal:71,pro:2.5,carb:12,fat:1.5,fib:1.7,sug:0.3,sod:49,ca:10,fe:0.8,vc:0,vd:0,va:0,vb:0,k:61,zn:0.5,mg:17,cho:0},
  {id:860,n:"Oatmeal (cooked with milk)",t:"🥣",c:"Oats",g:240,cal:100,pro:5.2,carb:16,fat:2.8,fib:1.5,sug:4.5,sod:67,ca:115,fe:0.8,vc:0,vd:0.6,va:35,vb:0.4,k:135,zn:0.7,mg:22,cho:5},

  // ══ 🥦 VEGETABLES ════════════════════════════════════════════════════════
  {id:901,n:"Broccoli",t:"🥦",c:"Veggies",g:100,cal:34,pro:2.8,carb:7,fat:0.4,fib:2.6,sug:1.7,sod:33,ca:47,fe:0.7,vc:89,vd:0,va:31,vb:0,k:316,zn:0.4,mg:21,cho:0},
  {id:902,n:"Spinach / Palak",t:"🥦",c:"Veggies",g:100,cal:23,pro:2.9,carb:3.6,fat:0.4,fib:2.2,sug:0.4,sod:79,ca:99,fe:2.7,vc:28,vd:0,va:469,vb:0,k:558,zn:0.5,mg:79,cho:0},
  {id:903,n:"Carrot",t:"🥦",c:"Veggies",g:100,cal:41,pro:0.9,carb:10,fat:0.2,fib:2.8,sug:4.7,sod:69,ca:33,fe:0.3,vc:5.9,vd:0,va:835,vb:0,k:320,zn:0.2,mg:12,cho:0},
  {id:904,n:"Tomato",t:"🥦",c:"Veggies",g:100,cal:18,pro:0.9,carb:3.9,fat:0.2,fib:1.2,sug:2.6,sod:5,ca:10,fe:0.3,vc:14,vd:0,va:42,vb:0,k:237,zn:0.2,mg:11,cho:0},
  {id:905,n:"Onion",t:"🥦",c:"Veggies",g:100,cal:40,pro:1.1,carb:9.3,fat:0.1,fib:1.7,sug:4.2,sod:4,ca:23,fe:0.2,vc:7.4,vd:0,va:0,vb:0,k:146,zn:0.2,mg:10,cho:0},
  {id:906,n:"Sweet Potato",t:"🥦",c:"Veggies",g:100,cal:86,pro:1.6,carb:20,fat:0.1,fib:3.0,sug:4.2,sod:55,ca:30,fe:0.6,vc:19,vd:0,va:961,vb:0,k:337,zn:0.3,mg:25,cho:0},
  {id:907,n:"Potato (boiled)",t:"🥦",c:"Veggies",g:100,cal:87,pro:1.9,carb:20,fat:0.1,fib:1.8,sug:0.9,sod:6,ca:12,fe:0.3,vc:19,vd:0,va:1,vb:0,k:379,zn:0.3,mg:22,cho:0},
  {id:908,n:"Drumstick / Moringa",t:"🥦",c:"Veggies",g:100,cal:64,pro:9.4,carb:8.3,fat:1.4,fib:2.0,sug:2.0,sod:42,ca:185,fe:4.0,vc:51,vd:0,va:378,vb:0,k:337,zn:0.6,mg:45,cho:0},
  {id:909,n:"Bittergourd / Pavakkai",t:"🥦",c:"Veggies",g:100,cal:17,pro:1.0,carb:3.7,fat:0.2,fib:2.8,sug:1.4,sod:5,ca:19,fe:0.4,vc:84,vd:0,va:24,vb:0,k:296,zn:0.1,mg:17,cho:0},
  {id:910,n:"Cauliflower",t:"🥦",c:"Veggies",g:100,cal:25,pro:1.9,carb:5.0,fat:0.3,fib:2.0,sug:1.9,sod:30,ca:22,fe:0.4,vc:48,vd:0,va:0,vb:0,k:299,zn:0.3,mg:15,cho:0},
  {id:911,n:"Mixed Sprouts",t:"🥦",c:"Veggies",g:100,cal:52,pro:4.9,carb:7.5,fat:0.5,fib:1.8,sug:0.6,sod:6,ca:23,fe:1.4,vc:14,vd:0,va:6,vb:0,k:195,zn:0.9,mg:28,cho:0},
  {id:912,n:"Cucumber",t:"🥦",c:"Veggies",g:100,cal:16,pro:0.7,carb:3.6,fat:0.1,fib:0.5,sug:1.7,sod:2,ca:16,fe:0.3,vc:2.8,vd:0,va:5,vb:0,k:147,zn:0.2,mg:13,cho:0},

  // ══ 🍌 FRUITS ════════════════════════════════════════════════════════════
  {id:1001,n:"Banana",t:"🍌",c:"Fruits",g:118,cal:89,pro:1.1,carb:23,fat:0.3,fib:2.6,sug:12,sod:1,ca:5,fe:0.3,vc:8.7,vd:0,va:3,vb:0,k:358,zn:0.2,mg:27,cho:0},
  {id:1002,n:"Mango",t:"🍌",c:"Fruits",g:100,cal:60,pro:0.8,carb:15,fat:0.4,fib:1.6,sug:14,sod:1,ca:11,fe:0.2,vc:36,vd:0,va:54,vb:0,k:168,zn:0.1,mg:10,cho:0},
  {id:1003,n:"Apple",t:"🍌",c:"Fruits",g:182,cal:52,pro:0.3,carb:14,fat:0.2,fib:2.4,sug:10,sod:1,ca:6,fe:0.1,vc:4.6,vd:0,va:3,vb:0,k:107,zn:0.04,mg:5,cho:0},
  {id:1004,n:"Orange",t:"🍌",c:"Fruits",g:131,cal:47,pro:0.9,carb:12,fat:0.1,fib:2.4,sug:9.4,sod:0,ca:40,fe:0.1,vc:53,vd:0,va:11,vb:0,k:181,zn:0.1,mg:10,cho:0},
  {id:1005,n:"Guava",t:"🍌",c:"Fruits",g:100,cal:68,pro:2.6,carb:14,fat:1.0,fib:5.4,sug:9.0,sod:2,ca:18,fe:0.3,vc:228,vd:0,va:31,vb:0,k:417,zn:0.2,mg:22,cho:0},
  {id:1006,n:"Papaya",t:"🍌",c:"Fruits",g:100,cal:43,pro:0.5,carb:11,fat:0.3,fib:1.7,sug:7.8,sod:8,ca:20,fe:0.1,vc:61,vd:0,va:47,vb:0,k:182,zn:0.1,mg:21,cho:0},
  {id:1007,n:"Watermelon",t:"🍌",c:"Fruits",g:280,cal:30,pro:0.6,carb:7.6,fat:0.2,fib:0.4,sug:6.2,sod:1,ca:7,fe:0.2,vc:8.1,vd:0,va:28,vb:0,k:112,zn:0.1,mg:10,cho:0},
  {id:1008,n:"Grapes",t:"🍌",c:"Fruits",g:80,cal:69,pro:0.7,carb:18,fat:0.2,fib:0.9,sug:15,sod:2,ca:10,fe:0.4,vc:3.2,vd:0,va:3,vb:0,k:191,zn:0.1,mg:7,cho:0},
  {id:1009,n:"Avocado",t:"🍌",c:"Fruits",g:100,cal:160,pro:2.0,carb:9.0,fat:15,fib:6.7,sug:0.7,sod:7,ca:12,fe:0.6,vc:10,vd:0,va:7,vb:0,k:485,zn:0.6,mg:29,cho:0},
  {id:1010,n:"Pomegranate",t:"🍌",c:"Fruits",g:100,cal:83,pro:1.7,carb:19,fat:1.2,fib:4.0,sug:14,sod:3,ca:10,fe:0.3,vc:10,vd:0,va:0,vb:0,k:236,zn:0.4,mg:12,cho:0},
  {id:1011,n:"Kiwi",t:"🍌",c:"Fruits",g:70,cal:61,pro:1.1,carb:15,fat:0.5,fib:3.0,sug:9.0,sod:3,ca:34,fe:0.3,vc:93,vd:0,va:4,vb:0,k:312,zn:0.1,mg:17,cho:0},
  {id:1012,n:"Strawberries",t:"🍌",c:"Fruits",g:100,cal:32,pro:0.7,carb:7.7,fat:0.3,fib:2.0,sug:4.9,sod:1,ca:16,fe:0.4,vc:59,vd:0,va:1,vb:0,k:153,zn:0.1,mg:13,cho:0},
  {id:1013,n:"Pineapple",t:"🍌",c:"Fruits",g:100,cal:50,pro:0.5,carb:13,fat:0.1,fib:1.4,sug:10,sod:1,ca:13,fe:0.3,vc:48,vd:0,va:3,vb:0,k:109,zn:0.1,mg:12,cho:0},

  // ══ 🫖 BEVERAGES ══════════════════════════════════════════════════════════
  {id:1201,n:"Chai (milk tea, no sugar)",t:"🫖",c:"Drinks",g:200,cal:25,pro:1.0,carb:3.5,fat:0.8,fib:0,sug:0,sod:20,ca:40,fe:0.1,vc:0,vd:0.1,va:8,vb:0.1,k:75,zn:0.1,mg:5,cho:3},
  {id:1202,n:"Chai (milk tea, 2 tsp sugar)",t:"🫖",c:"Drinks",g:200,cal:60,pro:1.0,carb:10,fat:0.8,fib:0,sug:8.0,sod:20,ca:40,fe:0.1,vc:0,vd:0.1,va:8,vb:0.1,k:75,zn:0.1,mg:5,cho:3},
  {id:1203,n:"Filter Coffee (with milk)",t:"🫖",c:"Drinks",g:200,cal:35,pro:1.2,carb:4.5,fat:1.5,fib:0,sug:4.0,sod:18,ca:45,fe:0.1,vc:0,vd:0.1,va:8,vb:0.1,k:75,zn:0.1,mg:6,cho:4},
  {id:1204,n:"Tender Coconut Water",t:"🫖",c:"Drinks",g:240,cal:19,pro:0.7,carb:3.7,fat:0.2,fib:1.1,sug:2.6,sod:105,ca:24,fe:0.3,vc:2.4,vd:0,va:0,vb:0,k:250,zn:0.1,mg:25,cho:0},
  {id:1205,n:"Fresh Orange Juice",t:"🫖",c:"Drinks",g:240,cal:45,pro:0.7,carb:10,fat:0.2,fib:0.2,sug:8.4,sod:1,ca:11,fe:0.2,vc:50,vd:0,va:4,vb:0,k:200,zn:0.1,mg:11,cho:0},
  {id:1206,n:"Protein Shake (whey+milk)",t:"🫖",c:"Drinks",g:350,cal:180,pro:30,carb:14,fat:3.5,fib:0.5,sug:8.5,sod:270,ca:310,fe:1.0,vc:0,vd:1.5,va:30,vb:0.5,k:450,zn:1.8,mg:55,cho:15},

  // ══ 💪 WHEY PROTEIN (Special: wheyBrand=true) ════════════════════════════
  {id:1101,n:"ON Gold Standard Whey",t:"💪",c:"Protein",g:31,cal:387,pro:77,carb:9.7,fat:5.2,fib:0,sug:3.2,sod:484,ca:355,fe:0,vc:0,vd:0,va:0,vb:0,k:374,zn:2.3,mg:68,cho:32,wheyBrand:true,proteinPer100g:77,defaultProtein:24},
  {id:1102,n:"MuscleBlaze Whey Gold",t:"💪",c:"Protein",g:33,cal:376,pro:76,carb:9.1,fat:5.5,fib:0,sug:3.0,sod:455,ca:340,fe:0,vc:0,vd:0,va:0,vb:0,k:360,zn:2.1,mg:65,cho:28,wheyBrand:true,proteinPer100g:76,defaultProtein:25},
  {id:1103,n:"MyProtein Impact Whey",t:"💪",c:"Protein",g:25,cal:384,pro:80,carb:8.0,fat:5.6,fib:0,sug:2.8,sod:504,ca:230,fe:0,vc:0,vd:0,va:0,vb:0,k:290,zn:1.8,mg:60,cho:25,wheyBrand:true,proteinPer100g:80,defaultProtein:20},
  {id:1104,n:"Dymatize ISO 100 Hydrolyzed",t:"💪",c:"Protein",g:29,cal:379,pro:90,carb:2.1,fat:0.7,fib:0,sug:1.7,sod:310,ca:103,fe:0,vc:0,vd:0,va:0,vb:0,k:275,zn:1.5,mg:45,cho:21,wheyBrand:true,proteinPer100g:90,defaultProtein:26},
  {id:1105,n:"Generic Whey Concentrate",t:"💪",c:"Protein",g:30,cal:400,pro:80,carb:10,fat:3.3,fib:0,sug:3.3,sod:533,ca:400,fe:1.3,vc:0,vd:0,va:0,vb:0,k:500,zn:2.7,mg:100,cho:33,wheyBrand:true,proteinPer100g:80,defaultProtein:24},
  {id:1106,n:"Casein Protein (slow-release)",t:"💪",c:"Protein",g:33,cal:364,pro:76,carb:12,fat:3.0,fib:0,sug:5.0,sod:455,ca:700,fe:0,vc:0,vd:0,va:0,vb:0,k:350,zn:1.5,mg:70,cho:20,wheyBrand:true,proteinPer100g:76,defaultProtein:25},
  {id:1107,n:"Protein Bar (High Protein)",t:"💪",c:"Protein",g:60,cal:333,pro:33,carb:42,fat:12,fib:5.0,sug:20,sod:367,ca:167,fe:4.2,vc:0,vd:0,va:0,vb:0,k:300,zn:2.0,mg:67,cho:8},
  {id:1108,n:"Soy Milk",t:"💪",c:"Protein",g:240,cal:54,pro:3.3,carb:6.3,fat:1.8,fib:0.4,sug:4.5,sod:51,ca:25,fe:0.6,vc:0,vd:0,va:0,vb:0,k:118,zn:0.2,mg:25,cho:0},
];

/* ─── SUPPORTING DATA ──────────────────────────────────────────────────────*/
const CATS = ["All","Tamil","N.Indian","Bread","Eggs","Dairy","Nuts","Meat","Grains","Oats","Veggies","Fruits","Protein","Drinks"];
const MEAL_TYPES = ["Breakfast","Lunch","Dinner","Snacks"];
const ACTIVITY_LEVELS = [
  {key:"sedentary",label:"Sedentary",desc:"Little or no exercise",mult:1.2},
  {key:"light",label:"Light",desc:"1–3 days/week",mult:1.375},
  {key:"moderate",label:"Moderate",desc:"3–5 days/week",mult:1.55},
  {key:"active",label:"Active",desc:"6–7 days/week",mult:1.725},
  {key:"veryActive",label:"Very Active",desc:"Twice a day",mult:1.9},
];
const GOALS_LIST = [
  {key:"lose",label:"Lose Weight",mod:-500},
  {key:"maintain",label:"Maintain",mod:0},
  {key:"gain",label:"Gain Muscle",mod:400},
];

/* ─── GOAL CALCULATOR ──────────────────────────────────────────────────────*/
function getGoals(p){
  const {age=25,gender="male",weightKg=70,heightCm=170,activity="moderate",goal="maintain"} = p;
  const bmr = gender==="male" ? 10*weightKg+6.25*heightCm-5*age+5 : 10*weightKg+6.25*heightCm-5*age-161;
  const actMult = ACTIVITY_LEVELS.find(a=>a.key===activity)?.mult||1.55;
  const goalMod = GOALS_LIST.find(g=>g.key===goal)?.mod||0;
  const cal = Math.round(bmr*actMult+goalMod);
  const protein = goal==="gain" ? Math.round(weightKg*2.2) : Math.round(weightKg*1.8);
  const fat = Math.round(cal*0.28/9);
  const carbs = Math.round((cal - protein*4 - fat*9)/4);
  const ag = age<18?"teen":age<50?"adult":"senior";
  return {
    cal, protein, carbs, fat,
    fiber: ag==="senior"?30:25, sugar:50, sodium:2300,
    calcium: ag==="teen"?1300:ag==="senior"?1200:1000,
    iron: gender==="female"&&age<50?18:ag==="teen"?11:8,
    vitC: ag==="teen"?65:90,
    vitD: ag==="senior"?20:15,
    vitA: gender==="male"?900:700,
    vitB12: ag==="senior"?2.8:2.4,
    potassium:3500, zinc: gender==="male"?11:8,
    magnesium: gender==="male"?(ag==="senior"?420:400):(ag==="senior"?320:310),
    cholesterol:300,
  };
}
const getBMI=(w,h)=>{
  if(!w||!h) return null;
  const b=w/((h/100)**2);
  const cat=b<18.5?"Underweight":b<25?"Normal":b<30?"Overweight":"Obese";
  const color=b<18.5?"#60a5fa":b<25?"#34d399":b<30?"#fbbf24":"#f87171";
  return {bmi:b.toFixed(1),cat,color};
};

/* ─── SCALE HELPERS ────────────────────────────────────────────────────────*/
const sc=(v,g)=>Math.round(v*(g/100)*10)/10;
const si=(v,g)=>Math.round(v*(g/100));

/* ─── BUILD LOGGED ITEM ────────────────────────────────────────────────────*/
const buildItem=(food,grams)=>({
  ...food, uid:Date.now()+Math.random(), logG:grams,
  cal:si(food.cal,grams), pro:sc(food.pro,grams), carb:sc(food.carb,grams), fat:sc(food.fat,grams),
  fib:sc(food.fib,grams), sug:sc(food.sug,grams), sod:si(food.sod,grams), ca:si(food.ca,grams),
  fe:sc(food.fe,grams), vc:sc(food.vc,grams), vd:sc(food.vd,grams), va:si(food.va,grams),
  vb:sc(food.vb,grams), k:si(food.k,grams), zn:sc(food.zn,grams), mg:si(food.mg,grams), cho:si(food.cho,grams),
});

const recomputeItem=(food,newG)=>{
  const base100=1/food.logG*100;
  return {...food, logG:newG,
    cal:si(food.cal*base100,newG), pro:sc(food.pro*base100,newG), carb:sc(food.carb*base100,newG), fat:sc(food.fat*base100,newG),
    fib:sc(food.fib*base100,newG), sug:sc(food.sug*base100,newG), sod:si(food.sod*base100,newG), ca:si(food.ca*base100,newG),
    fe:sc(food.fe*base100,newG), vc:sc(food.vc*base100,newG), vd:sc(food.vd*base100,newG), va:si(food.va*base100,newG),
    vb:sc(food.vb*base100,newG), k:si(food.k*base100,newG), zn:sc(food.zn*base100,newG), mg:si(food.mg*base100,newG), cho:si(food.cho*base100,newG),
  };
};

/* ─── SMALL COMPONENTS ─────────────────────────────────────────────────────*/
function CalRing({value,max,remaining}){
  const pct=Math.min(value/max,1), r=56, circ=2*Math.PI*r;
  const col=remaining>=0?"#22d3a5":remaining>-200?"#fbbf24":"#f87171";
  return(
    <svg width={136} height={136} viewBox="0 0 136 136">
      <circle cx={68} cy={68} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10}/>
      <circle cx={68} cy={68} r={r} fill="none" stroke={col} strokeWidth={10}
        strokeDasharray={`${pct*circ} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 68 68)" style={{transition:"stroke-dasharray 0.7s ease"}}/>
      <text x={68} y={61} textAnchor="middle" fill="white" fontSize={22} fontWeight="800" fontFamily="'Sora',sans-serif">{Math.abs(remaining)}</text>
      <text x={68} y={78} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={10} fontFamily="'Sora',sans-serif">{remaining>=0?"remaining":"over"}</text>
    </svg>
  );
}

function MacroOrb({value,max,color,label}){
  const pct=Math.min(value/max,1), r=22, circ=2*Math.PI*r;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
      <div style={{position:"relative",width:58,height:58}}>
        <svg width={58} height={58} viewBox="0 0 58 58" style={{position:"absolute"}}>
          <circle cx={29} cy={29} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5}/>
          <circle cx={29} cy={29} r={r} fill="none" stroke={color} strokeWidth={5}
            strokeDasharray={`${pct*circ} ${circ}`} strokeLinecap="round"
            transform="rotate(-90 29 29)" style={{transition:"stroke-dasharray 0.6s"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:10,fontWeight:700,color:"white"}}>{Math.round(value)}</span>
        </div>
      </div>
      <div style={{fontSize:9,color:color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</div>
      <div style={{fontSize:8,color:"rgba(255,255,255,0.25)"}}>/{max}g</div>
    </div>
  );
}

function NBar({label,value,max,unit,color,warn}){
  const v=value||0, pct=Math.min(v/max,1), over=v>max;
  const disp=v===0?"0":Number.isInteger(v)?v:v.toFixed(1);
  return(
    <div style={{marginBottom:9}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>{label}</span>
        <span style={{fontSize:11,fontWeight:600,color:over?"#f87171":warn&&pct>0.85?"#fbbf24":"rgba(255,255,255,0.8)"}}>
          {disp}<span style={{color:"rgba(255,255,255,0.3)",fontWeight:400}}>{unit}</span>
          <span style={{color:"rgba(255,255,255,0.2)",fontWeight:400}}> / {max}{unit}</span>
        </span>
      </div>
      <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,0.05)"}}>
        <div style={{height:"100%",width:`${pct*100}%`,borderRadius:2,
          background:over?`linear-gradient(90deg,${color},#f87171)`:color,transition:"width 0.5s"}}/>
      </div>
    </div>
  );
}

const TAG=(col,txt)=>(
  <span style={{background:col+"18",color:col,borderRadius:5,padding:"2px 6px",fontSize:9,fontWeight:700,display:"inline-block",marginRight:3,marginBottom:3,fontFamily:"'Sora',sans-serif"}}>{txt}</span>
);

/* ─── HELPERS ───────────────────────────────────────────────────────────────*/
const todayStr=()=>new Date().toISOString().slice(0,10); // "YYYY-MM-DD"
const EMPTY_MEALS={Breakfast:[],Lunch:[],Dinner:[],Snacks:[]};
const DEFAULT_PROFILE={age:25,gender:"male",weightKg:70,heightCm:170,activity:"moderate",goal:"maintain"};

/* ─── MAIN APP ─────────────────────────────────────────────────────────────*/
export default function FitTrack(){
  const [tab,setTab]=useState("home");
  const [meals,setMeals]=useState(EMPTY_MEALS);
  const [exercises,setExercises]=useState([]);
  const [water,setWater]=useState(0);
  const [profile,setProfile]=useState(DEFAULT_PROFILE);
  const [profileDraft,setProfileDraft]=useState(DEFAULT_PROFILE);
  const [storageReady,setStorageReady]=useState(false);
  const [savedBadge,setSavedBadge]=useState(false); // "Saved ✓" flash

  // ── LOAD FROM localStorage ON MOUNT ──────────────────────────────────────
  useEffect(()=>{
    try{
      const profRaw = localStorage.getItem("fittrack:profile");
      if(profRaw){ const p=JSON.parse(profRaw); setProfile(p); setProfileDraft(p); }

      const diaryRaw = localStorage.getItem("fittrack:diary");
      if(diaryRaw){
        const diary=JSON.parse(diaryRaw);
        if(diary.date===todayStr()){
          setMeals(diary.meals||EMPTY_MEALS);
          setExercises(diary.exercises||[]);
          setWater(diary.water||0);
        } else {
          localStorage.setItem("fittrack:diary", JSON.stringify({date:todayStr(),meals:EMPTY_MEALS,exercises:[],water:0}));
        }
      }
    } catch(e){ console.log("Storage load error:", e); }
    setStorageReady(true);
  },[]);

  // ── AUTO-SAVE DIARY WHENEVER IT CHANGES ────────────────────────────────────
  useEffect(()=>{
    if(!storageReady) return;
    try{
      localStorage.setItem("fittrack:diary", JSON.stringify({date:todayStr(),meals,exercises,water}));
      setSavedBadge(true);
      setTimeout(()=>setSavedBadge(false),1800);
    } catch(e){ console.log("Save error:", e); }
  },[meals,exercises,water,storageReady]);

  // ── AUTO-SAVE PROFILE ──────────────────────────────────────────────────────
  useEffect(()=>{
    if(!storageReady) return;
    try{ localStorage.setItem("fittrack:profile", JSON.stringify(profile)); } catch(e){}
  },[profile,storageReady]);

  // ── MIDNIGHT RESET CHECK (runs every minute) ───────────────────────────────
  useEffect(()=>{
    const check = setInterval(()=>{
      try{
        const diaryRaw = localStorage.getItem("fittrack:diary");
        if(diaryRaw){
          const diary=JSON.parse(diaryRaw);
          if(diary.date!==todayStr()){
            setMeals(EMPTY_MEALS);
            setExercises([]);
            setWater(0);
            localStorage.setItem("fittrack:diary", JSON.stringify({date:todayStr(),meals:EMPTY_MEALS,exercises:[],water:0}));
          }
        }
      } catch(e){}
    }, 60000);
    return ()=>clearInterval(check);
  },[]);

  // food modal
  const [activeMeal,setActiveMeal]=useState(null);
  const [search,setSearch]=useState("");
  const [cat,setCat]=useState("All");
  const [selFood,setSelFood]=useState(null);
  const [detailG,setDetailG]=useState(100);
  const [nutTab,setNutTab]=useState("macros");

  // whey protein adjuster
  const [wheyScoops,setWheyScoops]=useState(1);
  const [wheyProteinG,setWheyProteinG]=useState(24);

  // online search
  const [onlineResults,setOnlineResults]=useState([]);
  const [onlineLoading,setOnlineLoading]=useState(false);
  const [onlineError,setOnlineError]=useState("");
  const [lastOnlineQuery,setLastOnlineQuery]=useState("");

  // barcode scanner
  const [scannerOpen,setScannerOpen]=useState(false);
  const [scannerMeal,setScannerMeal]=useState(null);
  const [scanStatus,setScanStatus]=useState("idle");
  const [scanMsg,setScanMsg]=useState("");
  const [manualBarcode,setManualBarcode]=useState("");
  const videoRef=useRef(null);
  const streamRef=useRef(null);
  const rafRef=useRef(null);
  const lastBarcodeRef=useRef("");
  const scannerOpenRef=useRef(false);

  const goals=useMemo(()=>getGoals(profile),[profile]);
  const bmi=useMemo(()=>getBMI(profile.weightKg,profile.heightCm),[profile.weightKg,profile.heightCm]);
  const allItems=useMemo(()=>Object.values(meals).flat(),[meals]);
  const sum=useCallback(k=>allItems.reduce((s,i)=>s+(i[k]||0),0),[allItems]);
  const T=useMemo(()=>({cal:sum("cal"),pro:sum("pro"),carb:sum("carb"),fat:sum("fat"),fib:sum("fib"),sug:sum("sug"),sod:sum("sod"),ca:sum("ca"),fe:sum("fe"),vc:sum("vc"),vd:sum("vd"),va:sum("va"),vb:sum("vb"),k:sum("k"),zn:sum("zn"),mg:sum("mg"),cho:sum("cho")}),[sum]);
  const burned=exercises.reduce((s,e)=>s+e.cal,0);
  const netCal=T.cal-burned;
  const remaining=goals.cal-netCal;

  const filteredDB=useMemo(()=>DB.filter(f=>{
    const ms=search===""||f.n.toLowerCase().includes(search.toLowerCase());
    const mc=cat==="All"||f.c===cat;
    return ms&&mc;
  }),[search,cat]);

  const openFood=(food)=>{
    setSelFood(food);
    setDetailG(food.g);
    setNutTab("macros");
    if(food.wheyBrand){ setWheyScoops(1); setWheyProteinG(food.defaultProtein||24); }
  };

  const addFood=()=>{
    if(!selFood||!activeMeal) return;
    let grams=detailG;
    let item;
    if(selFood.wheyBrand){
      // For whey: compute grams from scoops, but override protein with user-set value
      grams=selFood.g*wheyScoops;
      item=buildItem(selFood,grams);
      item.pro=wheyProteinG*wheyScoops;
    } else {
      item=buildItem(selFood,grams);
    }
    setMeals(p=>({...p,[activeMeal]:[...p[activeMeal],item]}));
    setActiveMeal(null);setSearch("");setCat("All");setSelFood(null);setDetailG(100);
  };

  const removeItem=(m,uid)=>setMeals(p=>({...p,[m]:p[m].filter(i=>i.uid!==uid)}));

  // ── AI ONLINE FOOD SEARCH ─────────────────────────────────────────────────
  // ── ONLINE FOOD SEARCH via Open Food Facts (free, no API key needed) ────────
  const parseOFFProduct = (p) => {
    const n = p.nutriments || {};
    const nameRaw = p.product_name || p.product_name_en || p.brands || "";
    if(!nameRaw.trim()) return null;
    // Parse serving size string like "30g" or "1 serving (30g)" → extract grams
    const srvRaw = String(p.serving_size || "100");
    const srvMatch = srvRaw.match(/(\d+(?:\.\d+)?)\s*g/i);
    const srvG = srvMatch ? parseFloat(srvMatch[1]) : 100;
    const kcal = +(n["energy-kcal_100g"] || n["energy-kcal"] || (+(n["energy_100g"]||0)/4.184).toFixed(0) || 0);
    if(!kcal && !n["proteins_100g"]) return null; // skip empty entries
    return {
      n: nameRaw.slice(0,55),
      t: "🌐", c: "Online", g: srvG,
      cal:  kcal,
      pro:  +(n["proteins_100g"]    || 0),
      carb: +(n["carbohydrates_100g"]|| 0),
      fat:  +(n["fat_100g"]         || 0),
      fib:  +(n["fiber_100g"]       || 0),
      sug:  +(n["sugars_100g"]      || 0),
      sod:  Math.round((+(n["sodium_100g"]     ||0))*1000),
      ca:   Math.round((+(n["calcium_100g"]    ||0))*1000),
      fe:   +((+(n["iron_100g"]     ||0))*1000).toFixed(2),
      vc:   +((+(n["vitamin-c_100g"]||0))*1000).toFixed(1),
      vd:   +((+(n["vitamin-d_100g"]||0))*1000000).toFixed(2),
      va:   Math.round((+(n["vitamin-a_100g"]  ||0))*1000000),
      vb:   +((+(n["vitamin-b12_100g"]||0))*1000000).toFixed(2),
      k:    Math.round((+(n["potassium_100g"]  ||0))*1000),
      zn:   +((+(n["zinc_100g"]     ||0))*1000).toFixed(2),
      mg:   Math.round((+(n["magnesium_100g"]  ||0))*1000),
      cho:  +(n["cholesterol_100g"] || 0),
      online: true,
    };
  };

  const searchOnline = async (query) => {
    if(!query.trim() || query === lastOnlineQuery) return;
    setOnlineLoading(true);
    setOnlineError("");
    setOnlineResults([]);
    setLastOnlineQuery(query);

    const results = [];

    // ── Source 1: Open Food Facts full-text search (free, no key, CORS ok) ──
    try {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?` +
        `search_terms=${encodeURIComponent(query)}` +
        `&search_simple=1&action=process&json=1&page_size=8` +
        `&fields=product_name,product_name_en,brands,nutriments,serving_size,categories`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      const data = await res.json();
      if(data.products && data.products.length > 0){
        for(const p of data.products){
          const food = parseOFFProduct(p);
          if(food) results.push({ ...food, id:"ol_"+Date.now()+"_"+results.length });
          if(results.length >= 6) break;
        }
      }
    } catch(e){ console.log("OFF search error:", e); }

    // ── Source 2: Open Food Facts by category tag (catches Indian foods better) ──
    if(results.length === 0){
      try{
        const url2 = `https://world.openfoodfacts.org/cgi/search.pl?` +
          `search_terms=${encodeURIComponent(query)}&tagtype_0=countries&tag_contains_0=contains&tag_0=india` +
          `&action=process&json=1&page_size=6` +
          `&fields=product_name,product_name_en,brands,nutriments,serving_size`;
        const res2 = await fetch(url2, { signal: AbortSignal.timeout(6000) });
        const data2 = await res2.json();
        if(data2.products){
          for(const p of data2.products){
            const food = parseOFFProduct(p);
            if(food) results.push({ ...food, id:"ol_"+Date.now()+"_"+results.length });
            if(results.length >= 6) break;
          }
        }
      } catch(e){}
    }

    if(results.length > 0){
      setOnlineResults(results);
    } else {
      setOnlineError("No results found. Try a simpler name (e.g. 'rice' instead of 'cooked rice').");
    }
    setOnlineLoading(false);
  };

  // ── BARCODE SCANNER (fixed with proper useRef) ────────────────────────────
  const stopCamera=useCallback(()=>{
    if(rafRef.current){ cancelAnimationFrame(rafRef.current); rafRef.current=null; }
    if(streamRef.current){ streamRef.current.getTracks().forEach(t=>t.stop()); streamRef.current=null; }
  },[]);

  const lookupBarcode=useCallback(async(barcode)=>{
    const bc=String(barcode).trim();
    if(!bc||bc===lastBarcodeRef.current) return;
    lastBarcodeRef.current=bc;
    stopCamera();
    setScanStatus("fetching");
    setScanMsg(`🔍 Barcode: ${bc} — Searching…`);
    try{ navigator.vibrate&&navigator.vibrate([60,30,60]); }catch(e){}

    // ── 1. Open Food Facts (free, 3M+ global products, CORS-enabled) ────────
    try{
      const r=await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${bc}.json?fields=product_name,brands,nutriments,serving_size`,
        {signal:AbortSignal.timeout(6000)}
      );
      const d=await r.json();
      if(d.status===1&&d.product){
        const p=d.product;
        const nm=p.nutriments||{};
        // Parse serving size - strip non-numeric suffix e.g. "30g" or "1 slice (30g)"
        const rawSrv=String(p.serving_size||"100");
        const srvMatch=rawSrv.match(/(\d+(?:\.\d+)?)\s*g/i);
        const srvG=srvMatch?parseFloat(srvMatch[1]):100;
        const food={
          id:"bc_"+bc,
          n:((p.product_name||p.brands||"Unknown Product")+"").slice(0,55),
          t:"📦", c:"Scanned", g:srvG,
          cal: +(nm["energy-kcal_100g"]||nm["energy-kcal_serving"]||0),
          pro: +(nm["proteins_100g"]||0),
          carb:+(nm["carbohydrates_100g"]||0),
          fat: +(nm["fat_100g"]||0),
          fib: +(nm["fiber_100g"]||0),
          sug: +(nm["sugars_100g"]||0),
          sod: Math.round((+(nm["sodium_100g"]||0))*1000),
          ca:  Math.round((+(nm["calcium_100g"]||0))*1000),
          fe:  +((+(nm["iron_100g"]||0))*1000).toFixed(2),
          vc:  +((+(nm["vitamin-c_100g"]||0))*1000).toFixed(1),
          vd:  +((+(nm["vitamin-d_100g"]||0))*1000000).toFixed(2),
          va:  Math.round((+(nm["vitamin-a_100g"]||0))*1000000),
          vb:  +((+(nm["vitamin-b12_100g"]||0))*1000000).toFixed(2),
          k:   Math.round((+(nm["potassium_100g"]||0))*1000),
          zn:  +((+(nm["zinc_100g"]||0))*1000).toFixed(2),
          mg:  Math.round((+(nm["magnesium_100g"]||0))*1000),
          cho: +(nm["cholesterol_100g"]||0),
          barcode:bc, scanned:true,
        };
        setScanStatus("found");
        setScanMsg(`✅ Found: ${food.n}`);
        setScannerOpen(false); scannerOpenRef.current=false;
        setSelFood(food); setDetailG(srvG); setNutTab("macros");
        if(!activeMeal) setActiveMeal(scannerMeal||"Breakfast");
        return;
      }
    }catch(e){ /* try next source */ }

    // ── 2. UPC Item DB fallback ──────────────────────────────────────────────
    try{
      const r=await fetch(
        `https://api.upcitemdb.com/prod/trial/lookup?upc=${bc}`,
        {signal:AbortSignal.timeout(5000)}
      );
      const d=await r.json();
      if(d.code==="OK"&&d.items&&d.items[0]){
        const item=d.items[0];
        // UPC found product name — show it with basic info
        const food={
          id:"bc_"+bc, n:item.title.slice(0,55), t:"📦", c:"Scanned", g:100,
          cal:0,pro:0,carb:0,fat:0,fib:0,sug:0,sod:0,ca:0,fe:0,vc:0,vd:0,va:0,vb:0,k:0,zn:0,mg:0,cho:0,
          barcode:bc, scanned:true,
        };
        setScanStatus("found"); setScanMsg(`✅ Found: ${food.n}`);
        setScannerOpen(false); scannerOpenRef.current=false;
        setSelFood(food); setDetailG(100); setNutTab("macros");
        if(!activeMeal) setActiveMeal(scannerMeal||"Breakfast");
        return;
      }
    }catch(e){ /* try AI */ }

    // ── 3. Not found in any database ───────────────────────────────────────────
    setScanStatus("error");
    setScanMsg("❌ Product not found. Type the food name in the search above to find it.");
  },[activeMeal, scannerMeal, stopCamera]);

  const startScan=useCallback(()=>{
    if(typeof BarcodeDetector==="undefined"){
      setScanStatus("noBD"); return;
    }
    const detector=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e","code_128","code_39"]});
    let lastCode="";
    let timer=null;
    const loop=async()=>{
      if(!scannerOpenRef.current||!videoRef.current||!streamRef.current){ return; }
      try{
        const barcodes=await detector.detect(videoRef.current);
        if(barcodes.length>0){
          const code=barcodes[0].rawValue;
          if(code&&code!==lastCode){
            lastCode=code;
            clearTimeout(timer);
            timer=setTimeout(()=>lookupBarcode(code),350);
          }
        }
      }catch(e){}
      rafRef.current=requestAnimationFrame(loop);
    };
    rafRef.current=requestAnimationFrame(loop);
  },[lookupBarcode]);

  const openScanner=useCallback((meal)=>{
    lastBarcodeRef.current="";
    setScannerMeal(meal||activeMeal||"Breakfast");
    setScannerOpen(true); scannerOpenRef.current=true;
    setScanStatus("starting"); setScanMsg("Starting camera…");
    setManualBarcode("");
    // Start camera after state renders (100ms delay)
    setTimeout(async()=>{
      try{
        const stream=await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}}
        });
        streamRef.current=stream;
        if(videoRef.current){
          videoRef.current.srcObject=stream;
          await videoRef.current.play().catch(()=>{});
        }
        setScanStatus("scanning"); setScanMsg("Point camera at a barcode");
        startScan();
      }catch(e){
        setScanStatus("noCam");
        setScanMsg("Camera not available. Enter barcode below.");
      }
    },150);
  },[activeMeal, startScan]);

  const closeScanner=useCallback(()=>{
    scannerOpenRef.current=false;
    stopCamera();
    setScannerOpen(false);
    setScanStatus("idle"); setScanMsg("");
    setManualBarcode("");
    lastBarcodeRef.current="";
  },[stopCamera]);

  // Inline gram edit in diary
  const updateGrams=(mealType,food,newG)=>{
    const g=Math.max(1,parseInt(newG)||1);
    setMeals(p=>({...p,[mealType]:p[mealType].map(i=>i.uid===food.uid?recomputeItem(food,g):i)}));
  };

  const EXDB=[
    {id:1,n:"Running 5km/h (30 min)",e:"🏃",cal:240},{id:2,n:"Running 8km/h (30 min)",e:"🏃",cal:340},
    {id:3,n:"Cycling moderate (30 min)",e:"🚴",cal:260},{id:4,n:"Weight Training (45 min)",e:"🏋️",cal:215},
    {id:5,n:"Swimming (30 min)",e:"🏊",cal:300},{id:6,n:"HIIT (20 min)",e:"⚡",cal:380},
    {id:7,n:"Walking brisk (45 min)",e:"🚶",cal:195},{id:8,n:"Jump Rope (15 min)",e:"🪢",cal:215},
    {id:9,n:"Cricket (60 min)",e:"🏏",cal:330},{id:10,n:"Badminton (30 min)",e:"🏸",cal:245},
    {id:11,n:"Football (60 min)",e:"⚽",cal:420},{id:12,n:"Dance / Zumba (45 min)",e:"💃",cal:275},
    {id:13,n:"Stair Climbing (20 min)",e:"🪜",cal:185},{id:14,n:"Yoga (60 min)",e:"🧘",cal:185},
    {id:15,n:"Boxing (30 min)",e:"🥊",cal:360},{id:16,n:"Stretching (30 min)",e:"🤸",cal:95},
  ];

  const inputCss={background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"white",padding:"10px 14px",fontSize:13,fontFamily:"'Sora',sans-serif",outline:"none",boxSizing:"border-box"};
  const card=(children,extra={})=>(
    <div style={{background:"rgba(255,255,255,0.032)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:18,marginBottom:12,...extra}}>{children}</div>
  );
  const sLabel=(t)=><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",color:"rgba(255,255,255,0.3)",marginBottom:14}}>{t}</div>;

  // ── HOME TAB ──────────────────────────────────────────────────────────────
  const HomeTab=()=>(
    <div style={{padding:"0 16px"}}>
      <div style={{padding:"10px 0 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Today</div>
          <div style={{fontSize:20,fontWeight:800,color:"white",fontFamily:"'Sora',sans-serif",marginTop:2}}>Dashboard</div>
        </div>
        {bmi&&<div style={{background:bmi.color+"22",border:`1px solid ${bmi.color}44`,borderRadius:12,padding:"5px 11px",textAlign:"center"}}>
          <div style={{fontSize:16,fontWeight:800,color:bmi.color,fontFamily:"'Sora',sans-serif"}}>{bmi.bmi}</div>
          <div style={{fontSize:8,color:bmi.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>{bmi.cat}</div>
        </div>}
      </div>

      {card(<>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <CalRing value={netCal} max={goals.cal} remaining={remaining}/>
          <div style={{flex:1}}>
            {[["Goal",goals.cal,"#64748b"],["Eaten",T.cal,"#22d3a5"],["Burned",burned,"#f59e0b"],["Net",netCal,"white"]].map(([l,v,c])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <span style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>{l}</span>
                <span style={{fontSize:12,fontWeight:700,color:c,fontFamily:"'Sora',sans-serif"}}>{v} kcal</span>
              </div>
            ))}
          </div>
        </div>
      </>)}

      {card(<>
        {sLabel("Macronutrients")}
        <div style={{display:"flex",justifyContent:"space-around"}}>
          <MacroOrb value={T.pro} max={goals.protein} color="#22d3a5" label="Protein"/>
          <MacroOrb value={T.carb} max={goals.carbs} color="#f59e0b" label="Carbs"/>
          <MacroOrb value={T.fat} max={goals.fat} color="#f87171" label="Fat"/>
          <MacroOrb value={T.fib} max={goals.fiber} color="#a78bfa" label="Fiber"/>
        </div>
      </>)}

      {card(<>
        {sLabel("Micronutrients")}
        <NBar label="Sugar"       value={sc(T.sug,100)}   max={goals.sugar}      unit="g"   color="#f472b6" warn/>
        <NBar label="Sodium"      value={T.sod}            max={goals.sodium}     unit="mg"  color="#f87171" warn/>
        <NBar label="Calcium"     value={T.ca}             max={goals.calcium}    unit="mg"  color="#93c5fd"/>
        <NBar label="Iron"        value={parseFloat(T.fe.toFixed(1))} max={goals.iron} unit="mg" color="#fbbf24"/>
        <NBar label="Vitamin C"   value={parseFloat(T.vc.toFixed(1))} max={goals.vitC} unit="mg" color="#fb923c"/>
        <NBar label="Vitamin D"   value={parseFloat(T.vd.toFixed(1))} max={goals.vitD} unit="mcg" color="#fde68a"/>
        <NBar label="Vitamin A"   value={T.va}             max={goals.vitA}       unit="mcg" color="#f97316"/>
        <NBar label="Vitamin B12" value={parseFloat(T.vb.toFixed(1))} max={goals.vitB12} unit="mcg" color="#c084fc"/>
        <NBar label="Potassium"   value={T.k}              max={goals.potassium}  unit="mg"  color="#6ee7b7"/>
        <NBar label="Zinc"        value={parseFloat(T.zn.toFixed(1))} max={goals.zinc} unit="mg" color="#67e8f9"/>
        <NBar label="Magnesium"   value={T.mg}             max={goals.magnesium}  unit="mg"  color="#86efac"/>
        <NBar label="Cholesterol" value={T.cho}            max={goals.cholesterol} unit="mg" color="#fcd34d" warn/>
      </>)}

      {card(<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          {sLabel("Water Intake")}
          <span style={{fontSize:11,color:"#60a5fa",fontWeight:700,marginTop:-14}}>{water}/8 glasses</span>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {Array.from({length:8}).map((_,i)=>(
            <div key={i} onClick={()=>setWater(i+1)}
              style={{width:33,height:33,borderRadius:9,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,transition:"all 0.15s",
                background:i<water?"rgba(96,165,250,0.3)":"rgba(255,255,255,0.04)",
                border:`1px solid ${i<water?"rgba(96,165,250,0.5)":"rgba(255,255,255,0.06)"}`}}>💧</div>
          ))}
          <div onClick={()=>setWater(0)} style={{width:33,height:33,borderRadius:9,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",fontSize:11,color:"rgba(255,255,255,0.3)"}}>↺</div>
        </div>
      </>)}
    </div>
  );

  // ── DIARY TAB ─────────────────────────────────────────────────────────────
  const DiaryTab=()=>(
    <div style={{padding:"0 16px"}}>
      <div style={{padding:"10px 0 14px"}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Food Diary</div>
        <div style={{fontSize:20,fontWeight:800,color:"white",fontFamily:"'Sora',sans-serif",marginTop:2}}>Today's Meals</div>
      </div>

      {/* day summary chips */}
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:12}}>
        {[["Calories",`${T.cal}/${goals.cal}`,"#22d3a5","kcal"],["Protein",`${Math.round(T.pro)}/${goals.protein}`,"#34d399","g"],["Carbs",`${Math.round(T.carb)}`,"#f59e0b","g"],["Fat",`${Math.round(T.fat)}`,"#f87171","g"]].map(([l,v,c,u])=>(
          <div key={l} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${c}22`,borderRadius:14,padding:"10px 14px",flexShrink:0,minWidth:88}}>
            <div style={{fontSize:13,fontWeight:800,color:c,fontFamily:"'Sora',sans-serif"}}>{v}<span style={{fontSize:9,fontWeight:400,color:"rgba(255,255,255,0.3)"}}>{u}</span></div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>

      {MEAL_TYPES.map(mt=>{
        const items=meals[mt], mCal=items.reduce((s,i)=>s+i.cal,0);
        return(
          <div key={mt} style={{background:"rgba(255,255,255,0.032)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,marginBottom:10,overflow:"hidden"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 16px"}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"white"}}>{mt}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:1}}>{mCal} kcal · {items.length} items</div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>setActiveMeal(mt)}
                  style={{background:"rgba(34,211,165,0.12)",color:"#22d3a5",border:"1px solid rgba(34,211,165,0.25)",borderRadius:10,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>
                  + Add
                </button>
                <button onClick={()=>openScanner(mt)} title="Scan barcode"
                  style={{background:"rgba(96,165,250,0.12)",color:"#60a5fa",border:"1px solid rgba(96,165,250,0.28)",borderRadius:10,padding:"6px 10px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M22 8V5a2 2 0 00-2-2h-3M2 8V5a2 2 0 012-2h3M22 16v3a2 2 0 01-2 2h-3M2 16v3a2 2 0 002 2h3"/><line x1="7" y1="12" x2="17" y2="12"/></svg>
                  Scan
                </button>
              </div>
            </div>
            {items.map(food=>(
              <div key={food.uid} style={{padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.85)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{food.t} {food.n}</div>
                    {food.wheyBrand&&<div style={{fontSize:9,color:"#22d3a5",marginTop:1}}>🧬 Whey · {food.pro}g protein logged</div>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#22d3a5",fontFamily:"'Sora',sans-serif"}}>{food.cal}</span>
                    <button onClick={()=>removeItem(mt,food.uid)}
                      style={{background:"rgba(248,113,113,0.1)",border:"none",color:"#f87171",cursor:"pointer",borderRadius:6,width:24,height:24,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                  </div>
                </div>
                {/* Gram adjuster */}
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontSize:9,color:"rgba(255,255,255,0.3)",whiteSpace:"nowrap"}}>g:</span>
                  <input type="number" min="1" max="2000" defaultValue={food.logG}
                    onBlur={e=>updateGrams(mt,food,e.target.value)}
                    style={{width:58,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:7,color:"white",padding:"3px 6px",fontSize:11,fontFamily:"'Sora',sans-serif",outline:"none",textAlign:"center"}}/>
                  <input type="range" min="1" max="500" defaultValue={Math.min(food.logG,500)}
                    onMouseUp={e=>updateGrams(mt,food,e.target.value)}
                    onTouchEnd={e=>updateGrams(mt,food,e.target.value)}
                    style={{flex:1,accentColor:"#22d3a5",cursor:"pointer"}}/>
                </div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {[[food.pro,"P","#22d3a5"],[food.carb,"C","#f59e0b"],[food.fat,"F","#f87171"],[food.fib,"Fi","#a78bfa"],[food.sod,"Na","#f87171"],[food.ca,"Ca","#93c5fd"]].map(([v,l,c])=>(
                    <span key={l} style={{background:c+"18",color:c,borderRadius:4,padding:"2px 5px",fontSize:9,fontWeight:700}}>{l} {typeof v==="number"?Number.isInteger(v)?v:v.toFixed(1):v}{l==="Na"||l==="Ca"?"mg":"g"}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
      <div style={{background:"rgba(34,211,165,0.07)",border:"1px solid rgba(34,211,165,0.18)",borderRadius:16,padding:"12px 16px",display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <span style={{fontSize:13,fontWeight:700,color:"#22d3a5"}}>Daily Total</span>
        <span style={{fontSize:13,fontWeight:800,color:"#22d3a5",fontFamily:"'Sora',sans-serif"}}>{T.cal} kcal</span>
      </div>
    </div>
  );

  // ── EXERCISE TAB ──────────────────────────────────────────────────────────
  const ExerciseTab=()=>{
    const [showEx,setShowEx]=useState(false);
    const [exQ,setExQ]=useState("");
    return(
      <div style={{padding:"0 16px"}}>
        <div style={{padding:"10px 0 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Activity</div>
            <div style={{fontSize:20,fontWeight:800,color:"white",fontFamily:"'Sora',sans-serif",marginTop:2}}>Exercise Log</div>
          </div>
          <button onClick={()=>setShowEx(true)}
            style={{background:"linear-gradient(135deg,#22d3a5,#0891b2)",border:"none",borderRadius:12,color:"white",padding:"10px 18px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>
            + Log
          </button>
        </div>

        {card(<div style={{display:"flex",justifyContent:"space-around",textAlign:"center"}}>
          {[["🔥",`${burned}`,`kcal burned`],["🥗",`${T.cal}`,`kcal eaten`],["⚖️",`${Math.abs(remaining)}`,remaining>=0?"kcal left":"kcal over"]].map(([ic,v,l])=>(
            <div key={l}>
              <div style={{fontSize:22,marginBottom:4}}>{ic}</div>
              <div style={{fontSize:16,fontWeight:800,color:"white",fontFamily:"'Sora',sans-serif"}}>{v}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.06em",marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>)}

        {exercises.length===0&&<div style={{textAlign:"center",padding:"50px 20px",color:"rgba(255,255,255,0.2)"}}>
          <div style={{fontSize:48,marginBottom:10}}>🏃</div>
          <div style={{fontSize:13}}>No exercises logged</div>
        </div>}

        {exercises.map(ex=>(
          <div key={ex.uid} style={{background:"rgba(255,255,255,0.032)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"13px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:24}}>{ex.e}</span>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:"white"}}>{ex.n}</div>
                <div style={{fontSize:11,color:"#f59e0b",fontWeight:700,marginTop:2,fontFamily:"'Sora',sans-serif"}}>−{ex.cal} kcal</div>
              </div>
            </div>
            <button onClick={()=>setExercises(p=>p.filter(e=>e.uid!==ex.uid))}
              style={{background:"rgba(248,113,113,0.1)",border:"none",color:"#f87171",cursor:"pointer",borderRadius:8,width:28,height:28,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
        ))}

        {showEx&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.87)",display:"flex",alignItems:"flex-end",zIndex:200}} onClick={()=>setShowEx(false)}>
            <div style={{width:"100%",maxWidth:430,margin:"0 auto",background:"#0c1120",borderRadius:"22px 22px 0 0",border:"1px solid rgba(255,255,255,0.08)",padding:20,maxHeight:"72vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
                <div style={{fontSize:16,fontWeight:700,color:"white",fontFamily:"'Sora',sans-serif"}}>Log Exercise</div>
                <button onClick={()=>setShowEx(false)} style={{background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",borderRadius:8,width:28,height:28,fontSize:16}}>×</button>
              </div>
              <input value={exQ} onChange={e=>setExQ(e.target.value)} placeholder="Search…"
                style={{...inputCss,width:"100%",marginBottom:12}}/>
              {EXDB.filter(e=>e.n.toLowerCase().includes(exQ.toLowerCase())).map(ex=>(
                <div key={ex.id} onClick={()=>{setExercises(p=>[...p,{...ex,uid:Date.now()+Math.random()}]);setShowEx(false);}}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:20}}>{ex.e}</span>
                    <span style={{fontSize:13,color:"rgba(255,255,255,0.8)"}}>{ex.n}</span>
                  </div>
                  <span style={{fontSize:12,color:"#f59e0b",fontWeight:700}}>−{ex.cal}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── PROFILE TAB ───────────────────────────────────────────────────────────
  const ProfileTab=()=>{
    const pd=profileDraft;
    const dg=getGoals(pd);
    const db=getBMI(pd.weightKg,pd.heightCm);
    const set=(k,v)=>setProfileDraft(p=>({...p,[k]:v}));
    const idealMin=(18.5*(pd.heightCm/100)**2).toFixed(1);
    const idealMax=(24.9*(pd.heightCm/100)**2).toFixed(1);
    return(
      <div style={{padding:"0 16px"}}>
        <div style={{padding:"10px 0 14px"}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Settings</div>
          <div style={{fontSize:20,fontWeight:800,color:"white",fontFamily:"'Sora',sans-serif",marginTop:2}}>Your Profile</div>
        </div>

        {db&&card(<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>BMI</div>
              <div style={{fontSize:42,fontWeight:900,color:db.color,fontFamily:"'Sora',sans-serif",lineHeight:1}}>{db.bmi}</div>
              <div style={{fontSize:15,fontWeight:700,color:db.color,marginTop:4}}>{db.cat}</div>
            </div>
            <div style={{background:db.color+"18",border:`1px solid ${db.color}30`,borderRadius:14,padding:"12px 16px",textAlign:"center"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:4}}>Ideal weight</div>
              <div style={{fontSize:13,fontWeight:700,color:"white"}}>{idealMin}–{idealMax} kg</div>
              {db.cat!=="Normal"&&<div style={{fontSize:10,color:db.color,marginTop:4}}>
                {db.cat==="Underweight"?`Gain ${(idealMin-pd.weightKg).toFixed(1)}kg`:`Lose ${(pd.weightKg-idealMax).toFixed(1)}kg`}
              </div>}
            </div>
          </div>
          <div style={{height:6,borderRadius:3,background:"rgba(255,255,255,0.07)",overflow:"hidden",marginBottom:6}}>
            <div style={{height:"100%",width:`${Math.min((parseFloat(db.bmi)/40)*100,100)}%`,borderRadius:3,background:"linear-gradient(90deg,#60a5fa 0%,#34d399 25%,#fbbf24 62%,#f87171 100%)"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:"rgba(255,255,255,0.2)"}}>
            <span>&lt;18.5 Underwt</span><span>18.5–25 Normal</span><span>25–30 Overwt</span><span>&gt;30 Obese</span>
          </div>
        </>,{border:`1px solid ${db.color}30`,background:`linear-gradient(135deg,${db.color}10,rgba(255,255,255,0.02))`})}

        {card(<>
          {sLabel("Personal Details")}
          <div style={{display:"flex",gap:10,marginBottom:12}}>
            {[["male","♂ Male"],["female","♀ Female"]].map(([v,l])=>(
              <button key={v} onClick={()=>set("gender",v)}
                style={{flex:1,padding:"9px 0",borderRadius:10,border:`1.5px solid ${pd.gender===v?"#22d3a5":"rgba(255,255,255,0.1)"}`,background:pd.gender===v?"rgba(34,211,165,0.14)":"transparent",color:pd.gender===v?"#22d3a5":"rgba(255,255,255,0.45)",fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                {l}
              </button>
            ))}
          </div>
          {[["Age (years)","age"],["Weight (kg)","weightKg"],["Height (cm)","heightCm"]].map(([label,key])=>(
            <div key={key} style={{marginBottom:12}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</div>
              <input type="number" value={pd[key]} onChange={e=>set(key,+e.target.value)}
                style={{...inputCss,width:"100%",fontWeight:700,fontSize:16}}/>
            </div>
          ))}
        </>)}

        {card(<>
          {sLabel("Activity Level")}
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {ACTIVITY_LEVELS.map(a=>(
              <button key={a.key} onClick={()=>set("activity",a.key)}
                style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",borderRadius:11,border:`1.5px solid ${pd.activity===a.key?"#22d3a5":"rgba(255,255,255,0.07)"}`,background:pd.activity===a.key?"rgba(34,211,165,0.12)":"transparent",cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>
                <span style={{fontSize:13,fontWeight:600,color:pd.activity===a.key?"#22d3a5":"rgba(255,255,255,0.7)"}}>{a.label}</span>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{a.desc}</span>
              </button>
            ))}
          </div>
        </>)}

        {card(<>
          {sLabel("Goal")}
          <div style={{display:"flex",gap:8}}>
            {GOALS_LIST.map(g=>(
              <button key={g.key} onClick={()=>set("goal",g.key)}
                style={{flex:1,padding:"10px 4px",borderRadius:11,border:`1.5px solid ${pd.goal===g.key?"#22d3a5":"rgba(255,255,255,0.08)"}`,background:pd.goal===g.key?"rgba(34,211,165,0.14)":"transparent",color:pd.goal===g.key?"#22d3a5":"rgba(255,255,255,0.4)",fontFamily:"'Sora',sans-serif",fontSize:11,fontWeight:600,cursor:"pointer"}}>
                {g.label}
              </button>
            ))}
          </div>
        </>)}

        <button onClick={()=>setProfile(pd)}
          style={{width:"100%",padding:14,background:"linear-gradient(135deg,#22d3a5,#0891b2)",border:"none",borderRadius:14,color:"white",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'Sora',sans-serif",marginBottom:8}}>
          Save & Update Goals
        </button>

        {card(<>
          {sLabel("Your Daily Targets")}
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {[["Calories",dg.cal,"kcal","#22d3a5"],["Protein",dg.protein,"g","#34d399"],["Carbs",dg.carbs,"g","#f59e0b"],["Fat",dg.fat,"g","#f87171"],["Calcium",dg.calcium,"mg","#93c5fd"],["Iron",dg.iron,"mg","#fbbf24"],["Vit D",dg.vitD,"mcg","#fde68a"],["Vit B12",dg.vitB12,"mcg","#c084fc"]].map(([l,v,u,c])=>(
              <div key={l} style={{background:c+"14",border:`1px solid ${c}28`,borderRadius:10,padding:"7px 10px",minWidth:72,textAlign:"center"}}>
                <div style={{fontSize:12,fontWeight:800,color:c,fontFamily:"'Sora',sans-serif"}}>{v}<span style={{fontSize:9,fontWeight:400}}>{u}</span></div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",marginTop:1}}>{l}</div>
              </div>
            ))}
          </div>
        </>)}
      </div>
    );
  };

  // ── FOOD MODAL ────────────────────────────────────────────────────────────
  const renderFoodModal=()=>{
    const isWhey=selFood?.wheyBrand;
    // Whey-adjusted cal display
    const wCal=isWhey ? Math.round(selFood.cal*(selFood.g*wheyScoops)/100) : 0;
    const wCarb=isWhey ? sc(selFood.carb,selFood.g*wheyScoops) : 0;
    const wFat=isWhey ? sc(selFood.fat,selFood.g*wheyScoops) : 0;

    const macroData=[
      {l:"Protein",v:isWhey?wheyProteinG*wheyScoops:sc(selFood?.pro||0,detailG),max:goals.protein,u:"g",col:"#22d3a5"},
      {l:"Carbs",v:isWhey?wCarb:sc(selFood?.carb||0,detailG),max:goals.carbs,u:"g",col:"#f59e0b"},
      {l:"Fat",v:isWhey?wFat:sc(selFood?.fat||0,detailG),max:goals.fat,u:"g",col:"#f87171"},
      {l:"Fiber",v:sc(selFood?.fib||0,isWhey?selFood.g*wheyScoops:detailG),max:goals.fiber,u:"g",col:"#a78bfa"},
      {l:"Sugar",v:sc(selFood?.sug||0,isWhey?selFood.g*wheyScoops:detailG),max:goals.sugar,u:"g",col:"#f472b6"},
      {l:"Chol.",v:si(selFood?.cho||0,isWhey?selFood.g*wheyScoops:detailG),max:goals.cholesterol,u:"mg",col:"#fcd34d"},
    ];
    const microData=[
      {l:"Sodium",v:si(selFood?.sod||0,isWhey?selFood.g*wheyScoops:detailG),max:goals.sodium,u:"mg",col:"#f87171"},
      {l:"Calcium",v:si(selFood?.ca||0,isWhey?selFood.g*wheyScoops:detailG),max:goals.calcium,u:"mg",col:"#93c5fd"},
      {l:"Iron",v:sc(selFood?.fe||0,isWhey?selFood.g*wheyScoops:detailG),max:goals.iron,u:"mg",col:"#fbbf24"},
      {l:"Vit C",v:sc(selFood?.vc||0,isWhey?selFood.g*wheyScoops:detailG),max:goals.vitC,u:"mg",col:"#fb923c"},
      {l:"Vit D",v:sc(selFood?.vd||0,isWhey?selFood.g*wheyScoops:detailG),max:goals.vitD,u:"mcg",col:"#fde68a"},
      {l:"Vit A",v:si(selFood?.va||0,isWhey?selFood.g*wheyScoops:detailG),max:goals.vitA,u:"mcg",col:"#f97316"},
      {l:"Vit B12",v:sc(selFood?.vb||0,isWhey?selFood.g*wheyScoops:detailG),max:goals.vitB12,u:"mcg",col:"#c084fc"},
      {l:"Potassium",v:si(selFood?.k||0,isWhey?selFood.g*wheyScoops:detailG),max:goals.potassium,u:"mg",col:"#6ee7b7"},
      {l:"Zinc",v:sc(selFood?.zn||0,isWhey?selFood.g*wheyScoops:detailG),max:goals.zinc,u:"mg",col:"#67e8f9"},
      {l:"Magnesium",v:si(selFood?.mg||0,isWhey?selFood.g*wheyScoops:detailG),max:goals.magnesium,u:"mg",col:"#86efac"},
    ];

    return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:200}} onClick={()=>{setActiveMeal(null);setSearch("");setCat("All");setSelFood(null);}}>
        <div style={{width:"100%",maxWidth:430,margin:"0 auto",background:"#0b1020",borderRadius:"22px 22px 0 0",border:"1px solid rgba(255,255,255,0.09)",maxHeight:"95vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>

          {selFood?(
            /* ── FOOD DETAIL ── */
            <div style={{padding:20}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <button onClick={()=>setSelFood(null)}
                  style={{background:"rgba(255,255,255,0.06)",border:"none",color:"white",width:34,height:34,borderRadius:9,cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:700,color:"white",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{selFood.t} {selFood.n}</div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{selFood.c} · {selFood.cal} kcal / 100g</div>
                    {selFood.scanned&&<span style={{background:"rgba(34,211,165,0.15)",color:"#22d3a5",fontSize:8,fontWeight:700,borderRadius:4,padding:"1px 5px"}}>📦 SCANNED</span>}
                    {selFood.online&&!selFood.scanned&&<span style={{background:"rgba(96,165,250,0.15)",color:"#60a5fa",fontSize:8,fontWeight:700,borderRadius:4,padding:"1px 5px"}}>🌐 ONLINE</span>}
                  </div>
                </div>
              </div>

              {/* ── WHEY PROTEIN ADJUSTER ── */}
              {isWhey?(
                <div style={{background:"rgba(34,211,165,0.08)",border:"1px solid rgba(34,211,165,0.25)",borderRadius:16,padding:16,marginBottom:16}}>
                  <div style={{fontSize:11,color:"#22d3a5",fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.08em"}}>🧬 Whey Protein Adjuster</div>
                  <div style={{display:"flex",gap:10,alignItems:"stretch",marginBottom:14}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:5}}>Scoops</div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <button onClick={()=>setWheyScoops(Math.max(1,wheyScoops-1))}
                          style={{width:32,height:32,borderRadius:8,background:"rgba(255,255,255,0.08)",border:"none",color:"white",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                        <div style={{fontSize:22,fontWeight:900,color:"#22d3a5",fontFamily:"'Sora',sans-serif",minWidth:28,textAlign:"center"}}>{wheyScoops}</div>
                        <button onClick={()=>setWheyScoops(Math.min(6,wheyScoops+1))}
                          style={{width:32,height:32,borderRadius:8,background:"rgba(255,255,255,0.08)",border:"none",color:"white",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                      </div>
                    </div>
                    <div style={{width:1,background:"rgba(255,255,255,0.07)"}}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:5}}>Protein/scoop (g)</div>
                      <input type="number" min="10" max="50" value={wheyProteinG}
                        onChange={e=>setWheyProteinG(Math.max(10,Math.min(50,+e.target.value||24)))}
                        style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(34,211,165,0.3)",borderRadius:8,color:"white",padding:"6px 10px",fontSize:18,fontWeight:800,fontFamily:"'Sora',sans-serif",outline:"none",textAlign:"center"}}/>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                    <div style={{textAlign:"center",background:"rgba(34,211,165,0.12)",borderRadius:12,padding:"10px 16px"}}>
                      <div style={{fontSize:26,fontWeight:900,color:"#22d3a5",fontFamily:"'Sora',sans-serif",lineHeight:1}}>{wheyProteinG*wheyScoops}<span style={{fontSize:12,fontWeight:400}}>g</span></div>
                      <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",marginTop:2}}>PROTEIN</div>
                    </div>
                    <div style={{textAlign:"center",background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"10px 16px"}}>
                      <div style={{fontSize:26,fontWeight:900,color:"white",fontFamily:"'Sora',sans-serif",lineHeight:1}}>{wCal}<span style={{fontSize:12,fontWeight:400}}>kcal</span></div>
                      <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",marginTop:2}}>{wheyScoops} SCOOP{wheyScoops>1?"S":""} · {selFood.g*wheyScoops}g</div>
                    </div>
                  </div>
                </div>
              ):(
                /* ── REGULAR GRAM ADJUSTER ── */
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:14,marginBottom:14}}>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.08em"}}>Serving Size</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                    {[selFood.g,50,100,150,200].filter((v,i,a)=>a.indexOf(v)===i).map(g=>(
                      <button key={g} onClick={()=>setDetailG(g)}
                        style={{padding:"5px 12px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"'Sora',sans-serif",fontSize:11,fontWeight:700,
                          background:detailG===g?"#22d3a5":"rgba(255,255,255,0.07)",
                          color:detailG===g?"#000":g===selFood.g?"#22d3a5":"rgba(255,255,255,0.5)"}}>
                        {g===selFood.g?`${g}g (default)`:`${g}g`}
                      </button>
                    ))}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <input type="number" min="1" max="2000" value={detailG} onChange={e=>setDetailG(Math.max(1,+e.target.value||1))}
                      style={{width:80,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(34,211,165,0.4)",borderRadius:8,color:"white",padding:"6px 0",fontSize:16,fontFamily:"'Sora',sans-serif",outline:"none",textAlign:"center",fontWeight:700}}/>
                    <span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>g</span>
                    <input type="range" min="1" max="500" value={Math.min(detailG,500)} onChange={e=>setDetailG(+e.target.value)}
                      style={{flex:1,accentColor:"#22d3a5",cursor:"pointer"}}/>
                    <div style={{textAlign:"right",minWidth:50}}>
                      <div style={{fontSize:20,fontWeight:800,color:"#22d3a5",fontFamily:"'Sora',sans-serif",lineHeight:1}}>{si(selFood.cal,detailG)}</div>
                      <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>kcal</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Nut tabs */}
              <div style={{display:"flex",gap:6,marginBottom:14}}>
                {["macros","micros"].map(t=>(
                  <button key={t} onClick={()=>setNutTab(t)}
                    style={{flex:1,padding:"7px 0",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:700,textTransform:"capitalize",
                      background:nutTab===t?"rgba(34,211,165,0.18)":"rgba(255,255,255,0.05)",
                      color:nutTab===t?"#22d3a5":"rgba(255,255,255,0.4)"}}>
                    {t}
                  </button>
                ))}
              </div>
              {(nutTab==="macros"?macroData:microData).map(m=>(
                <NBar key={m.l} label={m.l} value={m.v} max={m.max} unit={m.u} color={m.col}/>
              ))}

              <button onClick={addFood}
                style={{width:"100%",padding:14,background:"linear-gradient(135deg,#22d3a5,#0891b2)",border:"none",borderRadius:14,color:"white",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'Sora',sans-serif",marginTop:8}}>
                Add to {activeMeal}
              </button>
            </div>
          ):(
            /* ── FOOD LIST ── */
            <div style={{padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontSize:16,fontWeight:700,color:"white",fontFamily:"'Sora',sans-serif"}}>Add to {activeMeal}</div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <button onClick={()=>{setActiveMeal(activeMeal);openScanner(activeMeal);}}
                    style={{background:"rgba(34,211,165,0.12)",border:"1px solid rgba(34,211,165,0.3)",color:"#22d3a5",cursor:"pointer",borderRadius:9,padding:"5px 12px",fontSize:12,fontWeight:700,fontFamily:"'Sora',sans-serif",display:"flex",alignItems:"center",gap:5}}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                      <path d="M22 8V5a2 2 0 00-2-2h-3M2 8V5a2 2 0 012-2h3M22 16v3a2 2 0 01-2 2h-3M2 16v3a2 2 0 002 2h3"/>
                      <line x1="7" y1="12" x2="7" y2="12"/><line x1="12" y1="12" x2="17" y2="12"/>
                    </svg>
                    Scan
                  </button>
                  <button onClick={()=>{setActiveMeal(null);setSearch("");setCat("All");}}
                    style={{background:"rgba(255,255,255,0.06)",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",borderRadius:8,width:28,height:28,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                </div>
              </div>

              <input value={search} onChange={e=>{setSearch(e.target.value);setOnlineResults([]);setOnlineError("");setLastOnlineQuery("");}}
                placeholder={`Search ${DB.length} foods…`} autoFocus
                style={{...inputCss,width:"100%",marginBottom:10}}/>

              <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:8,marginBottom:6}}>
                {CATS.map(c=>(
                  <button key={c} onClick={()=>setCat(c)}
                    style={{padding:"5px 12px",borderRadius:18,border:"none",cursor:"pointer",fontFamily:"'Sora',sans-serif",fontSize:10,fontWeight:700,whiteSpace:"nowrap",
                      background:cat===c?"rgba(34,211,165,0.2)":"rgba(255,255,255,0.05)",
                      color:cat===c?"#22d3a5":"rgba(255,255,255,0.4)",
                      boxShadow:cat===c?"0 0 0 1px rgba(34,211,165,0.35)":"none"}}>
                    {c}
                  </button>
                ))}
              </div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",marginBottom:8}}>{filteredDB.length} local results · tap to adjust grams</div>

              {/* ── LOCAL RESULTS ── */}
              {filteredDB.map(food=>(
                <div key={food.id} onClick={()=>openFood(food)}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",cursor:"pointer"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <span style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.85)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:220}}>{food.t} {food.n}</span>
                      {food.wheyBrand&&<span style={{background:"rgba(34,211,165,0.15)",color:"#22d3a5",fontSize:8,fontWeight:700,borderRadius:4,padding:"1px 5px",flexShrink:0}}>WHEY</span>}
                    </div>
                    <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                      {TAG("#22d3a5",`P ${food.pro}g`)}
                      {TAG("#f59e0b",`C ${food.carb}g`)}
                      {TAG("#f87171",`F ${food.fat}g`)}
                      <span style={{fontSize:9,color:"rgba(255,255,255,0.2)",padding:"2px 4px"}}>per 100g</span>
                    </div>
                  </div>
                  <div style={{textAlign:"right",marginLeft:10,flexShrink:0}}>
                    <div style={{fontSize:15,fontWeight:800,color:"#22d3a5",fontFamily:"'Sora',sans-serif"}}>{Math.round(food.cal*food.g/100)}</div>
                    <div style={{fontSize:8,color:"rgba(255,255,255,0.3)"}}>{food.g}g srv</div>
                  </div>
                  <span style={{color:"rgba(255,255,255,0.2)",marginLeft:6,fontSize:15}}>›</span>
                </div>
              ))}

              {/* ── ONLINE SEARCH SECTION ── */}
              {search.trim().length>1&&(
                <div style={{marginTop:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                    <div style={{flex:1,height:1,background:"rgba(255,255,255,0.07)"}}/>
                    <span style={{fontSize:9,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Not found?</span>
                    <div style={{flex:1,height:1,background:"rgba(255,255,255,0.07)"}}/>
                  </div>
                  <button
                    onClick={()=>searchOnline(search)}
                    disabled={onlineLoading}
                    style={{width:"100%",padding:"11px 0",borderRadius:12,border:"1.5px dashed rgba(99,179,237,0.4)",background:"rgba(99,179,237,0.06)",color:"#60a5fa",fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,cursor:onlineLoading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10}}>
                    {onlineLoading
                      ? <><span style={{display:"inline-block",width:14,height:14,borderRadius:"50%",border:"2px solid rgba(96,165,250,0.3)",borderTopColor:"#60a5fa",animation:"spin 0.8s linear infinite"}}/>Searching online…</>
                      : <>🌐 Search "{search}" online</>}
                  </button>
                  {onlineError&&<div style={{fontSize:11,color:"#f87171",textAlign:"center",marginBottom:8}}>{onlineError}</div>}
                  {onlineResults.length>0&&(
                    <div>
                      <div style={{fontSize:9,color:"#60a5fa",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>🌐 Online Results · AI Nutrition Data</div>
                      {onlineResults.map(food=>(
                        <div key={food.id} onClick={()=>openFood(food)}
                          style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:"1px solid rgba(99,179,237,0.08)",cursor:"pointer",background:"rgba(99,179,237,0.03)",borderRadius:8,paddingLeft:8,paddingRight:8,marginBottom:2}}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                              <span style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.9)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:200}}>{food.t} {food.n}</span>
                              <span style={{background:"rgba(96,165,250,0.18)",color:"#60a5fa",fontSize:8,fontWeight:700,borderRadius:4,padding:"1px 5px",flexShrink:0}}>ONLINE</span>
                            </div>
                            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                              {TAG("#22d3a5",`P ${food.pro}g`)}
                              {TAG("#f59e0b",`C ${food.carb}g`)}
                              {TAG("#f87171",`F ${food.fat}g`)}
                              <span style={{fontSize:9,color:"rgba(255,255,255,0.2)",padding:"2px 4px"}}>per 100g</span>
                            </div>
                          </div>
                          <div style={{textAlign:"right",marginLeft:10,flexShrink:0}}>
                            <div style={{fontSize:15,fontWeight:800,color:"#60a5fa",fontFamily:"'Sora',sans-serif"}}>{Math.round(food.cal*(food.g||100)/100)}</div>
                            <div style={{fontSize:8,color:"rgba(255,255,255,0.3)"}}>{food.g||100}g</div>
                          </div>
                          <span style={{color:"rgba(96,165,250,0.4)",marginLeft:6,fontSize:15}}>›</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── NAV ───────────────────────────────────────────────────────────────────
  const navItems=[
    {k:"home",l:"Home",ic:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>},
    {k:"diary",l:"Diary",ic:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>},
    {k:"exercise",l:"Exercise",ic:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>},
    {k:"profile",l:"Profile",ic:<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>},
  ];

  return(
    <div style={{minHeight:"100vh",background:"#080d18",color:"white",fontFamily:"'Sora',sans-serif",maxWidth:430,margin:"0 auto",paddingBottom:82}}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`
        ::-webkit-scrollbar{width:0;height:0}
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:2px;background:rgba(255,255,255,0.12);outline:none}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#22d3a5;cursor:pointer}
        *{-webkit-tap-highlight-color:transparent;box-sizing:border-box}
        @keyframes spin{to{transform:rotate(360deg)}} @keyframes fadein{from{opacity:0}to{opacity:1}}
      `}</style>

      {/* Topbar */}
      <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(8,13,24,0.94)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"13px 20px 10px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontSize:19,fontWeight:900,color:"#22d3a5",letterSpacing:"-0.5px"}}>FitTrack</div>
              {savedBadge&&<span style={{fontSize:9,color:"#22d3a5",fontWeight:700,background:"rgba(34,211,165,0.12)",border:"1px solid rgba(34,211,165,0.3)",borderRadius:6,padding:"2px 7px"}}>✓ Saved</span>}
            </div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.22)",marginTop:1,letterSpacing:"0.08em",textTransform:"uppercase"}}>
              {new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})} · {storageReady?"auto-saves · resets at midnight":"loading…"}
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {bmi&&<div style={{background:bmi.color+"1a",border:`1px solid ${bmi.color}35`,borderRadius:9,padding:"3px 9px",fontSize:10,fontWeight:700,color:bmi.color}}>BMI {bmi.bmi}</div>}
            <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#22d3a5,#0891b2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900}}>
              {profile.gender==="male"?"👨":"👩"}
            </div>
          </div>
        </div>
      </div>

      <div style={{paddingTop:8}}>
        {tab==="home"&&<HomeTab/>}
        {tab==="diary"&&<DiaryTab/>}
        {tab==="exercise"&&<ExerciseTab/>}
        {tab==="profile"&&<ProfileTab/>}
      </div>

      {/* Bottom nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"rgba(8,13,24,0.97)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",padding:"10px 0 18px"}}>
        {navItems.map(item=>{
          const active=tab===item.k;
          return(
            <div key={item.k} onClick={()=>setTab(item.k)}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",transition:"all 0.2s"}}>
              <div style={{color:active?"#22d3a5":"rgba(255,255,255,0.28)",transition:"color 0.2s"}}>{item.ic}</div>
              <span style={{fontSize:9,letterSpacing:"0.07em",textTransform:"uppercase",fontWeight:active?700:500,color:active?"#22d3a5":"rgba(255,255,255,0.28)"}}>{item.l}</span>
              {active&&<div style={{width:18,height:2,borderRadius:1,background:"#22d3a5"}}/>}
            </div>
          );
        })}
      </div>

      {activeMeal&&renderFoodModal()}

      {/* ── BARCODE SCANNER MODAL ── */}
      {scannerOpen&&(
        <div style={{position:"fixed",inset:0,background:"#000",zIndex:300,display:"flex",flexDirection:"column"}}>
          {/* Header */}
          <div style={{padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(0,0,0,0.85)",backdropFilter:"blur(12px)"}}>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:"white",fontFamily:"'Sora',sans-serif"}}>📦 Barcode Scanner</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginTop:2}}>
                {scannerMeal&&`Adding to ${scannerMeal} · `}Open Food Facts + AI
              </div>
            </div>
            <button onClick={closeScanner}
              style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",color:"white",borderRadius:10,width:36,height:36,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>

          {/* Camera viewfinder */}
          <div style={{flex:1,position:"relative",overflow:"hidden",background:"#000",minHeight:200}}>
            <video ref={videoRef} style={{width:"100%",height:"100%",objectFit:"cover"}} playsInline muted/>

            {/* Dark overlay corners */}
            <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
              <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)"}}/>
              {/* Clear rectangle in center */}
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:260,height:150,background:"transparent",boxShadow:"0 0 0 9999px rgba(0,0,0,0.45)",borderRadius:4}}/>
              {/* Animated corner brackets */}
              {[["0%","0%"],["100%","0%"],["0%","100%"],["100%","100%"]].map(([l,t],i)=>{
                const isR=l==="100%", isB=t==="100%";
                const col=scanStatus==="fetching"?"#f59e0b":scanStatus==="error"?"#f87171":"#22d3a5";
                return(
                  <div key={i} style={{position:"absolute",top:"50%",left:"50%",
                    marginLeft:(isR?130:-130)-1,marginTop:(isB?75:-75)-1,width:28,height:28,
                    borderTop:isB?"none":`3px solid ${col}`,
                    borderBottom:isB?`3px solid ${col}`:"none",
                    borderLeft:isR?"none":`3px solid ${col}`,
                    borderRight:isR?`3px solid ${col}`:"none",
                  }}/>
                );
              })}
              {/* Scanning laser line */}
              {(scanStatus==="scanning"||scanStatus==="starting")&&(
                <div style={{position:"absolute",top:"50%",left:"50%",
                  transform:"translate(-50%,-50%)",width:256,height:2,
                  background:"linear-gradient(90deg,transparent 0%,#22d3a5 30%,#22d3a5 70%,transparent 100%)",
                  boxShadow:"0 0 8px #22d3a5",
                  animation:"scanline 1.8s ease-in-out infinite"}}/>
              )}
              {/* Fetching spinner */}
              {(scanStatus==="fetching")&&(
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
                  <div style={{width:44,height:44,borderRadius:"50%",border:"3px solid rgba(245,158,11,0.2)",borderTopColor:"#f59e0b",animation:"spin 0.8s linear infinite"}}/>
                </div>
              )}
            </div>

            {/* Status chip at bottom of viewfinder */}
            <div style={{position:"absolute",bottom:14,left:0,right:0,display:"flex",justifyContent:"center",pointerEvents:"none"}}>
              <div style={{background:"rgba(0,0,0,0.8)",backdropFilter:"blur(8px)",borderRadius:20,
                padding:"8px 20px",maxWidth:"88%",textAlign:"center",
                border:`1px solid ${scanStatus==="found"?"rgba(34,211,165,0.6)":scanStatus==="error"||scanStatus==="noCam"?"rgba(248,113,113,0.5)":"rgba(255,255,255,0.12)"}`}}>
                <div style={{fontSize:12,fontWeight:600,
                  color:scanStatus==="found"?"#22d3a5":scanStatus==="error"||scanStatus==="noCam"?"#f87171":scanStatus==="fetching"?"#f59e0b":"white"}}>
                  {scanMsg||"Initializing…"}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom panel: manual entry + instructions */}
          <div style={{background:"#0a0f1e",borderTop:"1px solid rgba(255,255,255,0.07)",padding:16}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700}}>
              Enter barcode manually
            </div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="e.g. 8901030869572"
                value={manualBarcode}
                onChange={e=>setManualBarcode(e.target.value.replace(/\D/g,""))}
                onKeyDown={e=>{if(e.key==="Enter"&&manualBarcode.length>=5)lookupBarcode(manualBarcode);}}
                style={{flex:1,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.14)",borderRadius:10,color:"white",padding:"11px 14px",fontSize:15,fontFamily:"'Sora',sans-serif",outline:"none",letterSpacing:"0.05em"}}
              />
              <button
                onClick={()=>{if(manualBarcode.length>=5)lookupBarcode(manualBarcode);}}
                disabled={manualBarcode.length<5||scanStatus==="fetching"}
                style={{background:manualBarcode.length>=5?"linear-gradient(135deg,#22d3a5,#0891b2)":"rgba(255,255,255,0.07)",border:"none",borderRadius:10,color:manualBarcode.length>=5?"white":"rgba(255,255,255,0.3)",padding:"11px 18px",fontSize:13,fontWeight:800,cursor:manualBarcode.length>=5?"pointer":"default",fontFamily:"'Sora',sans-serif",whiteSpace:"nowrap",transition:"all 0.2s"}}>
                {scanStatus==="fetching"?<span style={{display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"white",borderRadius:"50%",animation:"spin 0.8s linear infinite",verticalAlign:"middle"}}/>:"Search"}
              </button>
            </div>

            {/* Tips row */}
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["EAN-13","UPC-A","EAN-8","Code-128"].map(f=>(
                <span key={f} style={{background:"rgba(255,255,255,0.05)",borderRadius:6,padding:"3px 8px",fontSize:9,color:"rgba(255,255,255,0.3)"}}>
                  {f}
                </span>
              ))}
            </div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",marginTop:8}}>
              📡 Open Food Facts · UPC Item DB · Claude AI (3 sources)
            </div>

            {(scanStatus==="noBD")&&(
              <div style={{marginTop:10,padding:"10px 14px",background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:10}}>
                <div style={{fontSize:11,color:"#f59e0b",fontWeight:600}}>📷 Auto-scan not supported in this browser</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginTop:3}}>Type the barcode number above — all 3 databases still work.</div>
              </div>
            )}
          </div>
          <style>{`
            @keyframes scanline{0%,100%{transform:translate(-50%,-50%) translateY(-64px)}50%{transform:translate(-50%,-50%) translateY(64px)}}
          `}</style>
        </div>
      )}
    </div>
  );
}
