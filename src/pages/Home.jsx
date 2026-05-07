import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, subDays } from 'date-fns';
import { Egg, TrendingUp, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import PriceChart from '../components/PriceChart';

const API_URL = "https://data.moa.gov.tw/Service/OpenData/FromM/PoultryTransBoiledChickenData.aspx";
// 如果遇到 CORS 問題，請將下方改為您的 GAS 部署網址
const PROXY_URL = ""; 

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('egg'); // 'egg' or 'chicken'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    const endDate = format(new Date(), 'yyyy/MM/dd');
    const startDate = format(subDays(new Date(), 7), 'yyyy/MM/dd');
    
    const url = PROXY_URL 
      ? `${PROXY_URL}?StartDate=${startDate}&EndDate=${endDate}`
      : `${API_URL}?StartDate=${startDate}&EndDate=${endDate}`;

    try {
      const response = await axios.get(url);
      if (Array.isArray(response.data)) {
        // 資料映射處理
        const mappedData = response.data.map(item => ({
          date: item['日期'],
          egg_origin: parseFloat(item['雞蛋(產地價)']) || 0,
          egg_transport: parseFloat(item['雞蛋(大運輸價)']) || 0,
          chicken_20kg: parseFloat(item['白肉雞(2.0Kg以上)']) || 0,
          chicken_175_195kg: parseFloat(item['白肉雞(1.75-1.95Kg)']) || 0,
          chicken_market: parseFloat(item['白肉雞(門市價高屏)']) || 0,
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setData(mappedData);
      } else {
        throw new Error('資料格式不正確');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('無法取得資料，請確認網路連線或 CORS 設定。');
      // 如果是 CORS 報錯，這通常是開發環境的常見問題
      if (err.message.includes('Network Error')) {
        setError('偵測到跨網域 (CORS) 限制。請部署 GAS 代理轉發器並更新 PROXY_URL。');
      }
    } finally {
      setLoading(false);
    }
  };

  const getLatestPrice = (key) => {
    if (data.length === 0) return 0;
    return data[data.length - 1][key];
  };

  const getPriceTrend = (key) => {
    if (data.length < 2) return 0;
    const latest = data[data.length - 1][key];
    const previous = data[data.length - 2][key];
    return (latest - previous).toFixed(1);
  };

  return (
    <div className="home-container">
      <header className="app-header">
        <div className="title-wrapper">
          <Egg className="header-icon" size={32} />
          <h1>蛋價是多少</h1>
        </div>
      </header>

      <div className="toggle-container">
        <button 
          className={`toggle-btn ${activeCategory === 'egg' ? 'active' : ''}`}
          onClick={() => setActiveCategory('egg')}
        >
          <Egg size={20} />
          <span>蛋</span>
        </button>
        <button 
          className={`toggle-btn ${activeCategory === 'chicken' ? 'active' : ''}`}
          onClick={() => setActiveCategory('chicken')}
        >
          <TrendingUp size={20} />
          <span>雞肉</span>
        </button>
      </div>

      <main className="content">
        {loading ? (
          <div className="status-container">
            <Loader2 className="animate-spin" size={48} />
            <p>資料載入中...</p>
          </div>
        ) : error ? (
          <div className="status-container error">
            <AlertCircle size={48} />
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchData}>重試</button>
          </div>
        ) : (
          <div className="data-view">
            <div className="price-cards">
              {activeCategory === 'egg' ? (
                <>
                  <DataCard 
                    label="產地價 (元/台斤)" 
                    price={getLatestPrice('egg_origin')} 
                    trend={getPriceTrend('egg_origin')} 
                  />
                  <DataCard 
                    label="大運輸價 (元/台斤)" 
                    price={getLatestPrice('egg_transport')} 
                    trend={getPriceTrend('egg_transport')} 
                  />
                </>
              ) : (
                <>
                  <DataCard 
                    label="2.0Kg以上 (元/台斤)" 
                    price={getLatestPrice('chicken_20kg')} 
                    trend={getPriceTrend('chicken_20kg')} 
                  />
                  <DataCard 
                    label="1.75-1.95Kg (元/台斤)" 
                    price={getLatestPrice('chicken_175_195kg')} 
                    trend={getPriceTrend('chicken_175_195kg')} 
                  />
                  <DataCard 
                    label="高屏門市 (元/台斤)" 
                    price={getLatestPrice('chicken_market')} 
                    trend={getPriceTrend('chicken_market')} 
                  />
                </>
              )}
            </div>

            <div className="chart-section">
              <PriceChart data={data} category={activeCategory} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const DataCard = ({ label, price, trend }) => {
  const trendValue = parseFloat(trend);
  const trendClass = trendValue > 0 ? 'trend-up' : trendValue < 0 ? 'trend-down' : 'trend-neutral';
  
  return (
    <div className="data-card">
      <div className="card-label">{label}</div>
      <div className="card-main">
        <div className="card-price">{price}</div>
        <div className={`card-trend ${trendClass}`}>
          {trendValue > 0 ? '+' : ''}{trend}
        </div>
      </div>
    </div>
  );
};

export default Home;
