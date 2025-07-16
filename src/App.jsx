import { useEffect, useState } from 'react';

const API_KEY = import.meta.env.VITE_BLOCKVISION_KEY;

export default function App() {
  const [mints, setMints] = useState([]);

  const fetchMints = async () => {
    const res = await fetch("https://api.blockvision.org/v2/monad/collection/activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
      },
      body: JSON.stringify({
        page: 1,
        pageSize: 20,
        method: "mint"
      })
    });

    const data = await res.json();
    setMints(data?.data?.activities || []);
  };

  useEffect(() => {
    fetchMints();
    const interval = setInterval(fetchMints, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">Monad NFT Hub – Live Mints</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {mints.map((nft, i) => (
          <div key={i} className="border rounded-xl p-4 shadow">
            <img src={nft?.nft?.image || ''} alt="NFT" className="w-full h-48 object-cover rounded-lg" />
            <div className="mt-2">
              <p><b>Collection:</b> {nft?.collectionName}</p>
              <p><b>Token:</b> #{nft?.tokenId}</p>
              <p><b>Wallet:</b> {nft?.to?.slice(0, 6)}...{nft?.to?.slice(-4)}</p>
              <p className="text-sm text-gray-600">{new Date(nft?.timestamp * 1000).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
