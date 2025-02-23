import React, { useState } from 'react';
import axios from 'axios';
import pokemonNameMapping from '../data/pokemonName.json';
import styles from '../style/style.module.css'; // CSSモジュールのインポート

// Add type declaration
const nameMapping: Record<string, string> = pokemonNameMapping;

interface PokemonInfo {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  flavorText: string;
  image: string;
}

const App: React.FC = () => {
  const [pokemonName, setPokemonName] = useState<string>('');
  const [pokemonData, setPokemonData] = useState<PokemonInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ポケモンデータを取得する関数
  const fetchPokemonData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 日本語名を英語名に変換
      const englishName = nameMapping[pokemonName];

      if (!englishName) {
        setError('ポケモンが見つかりません');
        setLoading(false);
        return;
      }

      const response = await axios.get<PokemonInfo>(`http://localhost:5001/api/pokemon/${englishName}`);
      setPokemonData(response.data);
    } catch (error) {
      setError('ポケモンのデータを取得できませんでした。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ポケモン情報</h1>
      <input
        className={styles.inputField}
        type="text"
        value={pokemonName}
        onChange={(e) => setPokemonName(e.target.value)}
        placeholder="ポケモンの名前を入力"
      />
      <button className={styles.button} onClick={fetchPokemonData}>検索</button>

      {loading && <p>読み込み中...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {pokemonData && (
        <div className={styles.pokemonCard}>
          <h2>{pokemonData.name}</h2>
          <img src={pokemonData.image} alt={pokemonData.name} />
          <p>番号: {pokemonData.id}</p>
          <p>身長: {pokemonData.height} decimetres</p>
          <p>体重: {pokemonData.weight} hectograms</p>

          <div className={styles.types}>
            {pokemonData.types.map((type, index) => (
              <span key={index} className={styles.type}>{type}</span>
            ))}
          </div>

          <p>説明: {pokemonData.flavorText}</p>
        </div>
      )}
    </div>
  );
};

export default App;
