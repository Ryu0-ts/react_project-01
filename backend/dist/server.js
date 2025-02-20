"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 5001;
app.use((0, cors_1.default)());
// タイプを日本語に変換するためのマッピング
const typeMapping = {
    electric: 'でんき',
    fire: 'ほのお',
    water: 'みず',
    grass: 'くさ',
    bug: 'むし',
    poison: 'どく',
    flying: 'ひこう',
    psychic: 'エスパー',
    rock: 'いわ',
    ghost: 'ゴースト',
    dragon: 'ドラゴン',
    steel: 'はがね',
    ice: 'こおり',
    fighting: 'かくとう',
    normal: 'ノーマル',
    dark: 'あく',
    fairy: 'フェアリー',
};
// ルーティング
app.get('/api/pokemon/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { name } = req.params;
    try {
        // ポケモンの基本情報を取得
        const response = yield axios_1.default.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const pokemonData = response.data;
        // ポケモンの詳細情報を取得
        const speciesResponse = yield axios_1.default.get(response.data.species.url);
        const flavorText = speciesResponse.data.flavor_text_entries;
        // 日本語の名前を取得
        const japaneseName = ((_a = speciesResponse.data.names.find((name) => name.language.name === 'ja')) === null || _a === void 0 ? void 0 : _a.name) || pokemonData.name;
        // 日本語の説明を取得
        const japaneseFlavorText = ((_b = flavorText.find((entry) => entry.language.name === 'ja')) === null || _b === void 0 ? void 0 : _b.flavor_text) || '見つかりませんでした';
        // ポケモンのタイプを日本語に変換
        const typesInJapanese = pokemonData.types.map((type) => typeMapping[type.type.name]);
        // ポケモンの情報を整形
        const pokemonInfo = {
            id: pokemonData.id, // ポケモンのID
            name: japaneseName, // ポケモンの名前
            height: pokemonData.height, // ポケモンの高さ
            weight: pokemonData.weight, // ポケモンの重さ
            types: typesInJapanese, // ポケモンのタイプ（日本語）
            flavorText: japaneseFlavorText, // ポケモンの説明
            image: pokemonData.sprites.other.dream_world.front_default, // ポケモンの画像
        };
        res.json(pokemonInfo);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'ポケモンが見つかりません' });
    }
}));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
