import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = 5001;

app.use(cors());

// タイプを日本語に変換するためのマッピング
const typeMapping: { [key: string]: string } = {
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
app.get('/api/pokemon/:name', async (req: Request, res: Response) => {
    const { name } = req.params;

    try {
        // ポケモンの基本情報を取得
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const pokemonData = response.data;

        // ポケモンの詳細情報を取得
        const speciesResponse = await axios.get(response.data.species.url);
        const flavorText = speciesResponse.data.flavor_text_entries;

        // 日本語の名前を取得
        const japaneseName = speciesResponse.data.names.find(
            (name: any) => name.language.name === 'ja'
        )?.name || pokemonData.name;

        // 日本語の説明を取得
        const japaneseFlavorText = flavorText.find(
            (entry: any) => entry.language.name === 'ja'
        )?.flavor_text || '見つかりませんでした';

        // ポケモンのタイプを日本語に変換
        const typesInJapanese = pokemonData.types.map((type: any) => typeMapping[type.type.name]);

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

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'ポケモンが見つかりません' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
