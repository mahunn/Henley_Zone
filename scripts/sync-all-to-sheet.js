const webhookUrl = 'https://script.google.com/macros/s/AKfycbwlPAQnXh0uOMX9B_6Y2hu84aSS9VwLj5yUXBdf5vY8VYsR5jMPwOjIhbkKlEL6UoOiyw/exec';

async function syncAllOrders() {
  console.log('Fetching all orders from production server...');
  const loginRes = await fetch('https://henleyzone.com/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'Arif', password: 'AdminArif123' })
  });

  const cookie = loginRes.headers.get('set-cookie');
  const res = await fetch('https://henleyzone.com/api/orders', {
    headers: { 'Cookie': cookie || '' }
  });

  const data = await res.json();
  const orders = data.orders || [];
  console.log(`Found ${orders.length} orders in database.`);

  // Sort orders oldest to newest so they appear in chronological order
  orders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  let successCount = 0;
  for (let i = 0; i < orders.length; i++) {
    const o = orders[i];
    const dt = new Date(o.createdAt || Date.now());
    const monthName = dt.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const dayHeading = dt.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const itemsFormatted = (o.items || [])
      .map((item) => {
        const parts = [item.name || 'Product'];
        if (item.selectedColor) parts.push(item.selectedColor);
        if (item.selectedSize) parts.push(`Size ${item.selectedSize}`);
        return `${parts.join(' - ')} (x${item.quantity || 1})`;
      })
      .join(', ');

    const payload = {
      orderId: o.id,
      date: o.createdAt,
      monthName,
      dayHeading,
      customerName: o.customerName || 'Customer',
      phone: o.phone || '',
      address: o.address || '',
      itemsFormatted,
      subtotal: o.subtotal || 0,
      deliveryFee: o.deliveryFee || 0,
      total: o.total || 0,
      status: (o.status || 'PENDING').toUpperCase(),
      note: o.note || ''
    };

    try {
      const resp = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const txt = await resp.text();
      successCount++;
      console.log(`[${i + 1}/${orders.length}] Synced Order ${o.id} -> ${monthName} (${dayHeading})`);
      // small delay to prevent rate limits
      await new Promise(r => setTimeout(r, 400));
    } catch (err) {
      console.error(`Failed to sync order ${o.id}:`, err.message);
    }
  }

  console.log(`\n🎉 Successfully synced ${successCount} / ${orders.length} orders into Google Sheet!`);
}

syncAllOrders();
