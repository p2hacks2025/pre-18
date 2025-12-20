const fetchItems = async () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      const queryParam = currentUser ? `?user=${currentUser}` : '';
      
      const response = await fetch(`https://pre-18-3r22.onrender.com${queryParam}`);
      
      const data = await response.json();

      if (data.success) {
        const formattedItems = data.stones.map(item => ({
          id: item.id,
          title: item.title,
          memo: item.memo,
          tags: item.tags || [], 
          date: item.created_at,
          
          // ▼▼▼ 修正2：'原石' も拾うようにする！重要！ ▼▼▼
          // DBの値をそのまま渡してあげるのが一番安全です
          object_type: item.object_type, 

          // 従来のフラグも一応直しておく
          isGem: item.object_type === '星' || item.object_type === '原石',
          isConstellation: item.object_type === '星座',
          
          isCompleted: false, 
          image: item.image,
          username: item.username 
        }));
        setItems(formattedItems);
      }
    } catch (error) {
      console.error("データの取得に失敗:", error);
    }
  };