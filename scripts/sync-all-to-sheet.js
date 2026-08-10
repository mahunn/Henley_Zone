const webhookUrl = 'https://script.google.com/macros/s/AKfycbwlPAQnXh0uOMX9B_6Y2hu84aSS9VwLj5yUXBdf5vY8VYsR5jMPwOjIhbkKlEL6UoOiyw/exec';

function formatBangladeshiDate(isoString) {
  const d = isoString ? new Date(isoString) : new Date();
  const date = Number.isNaN(d.getTime()) ? new Date() : d;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = String(hours).padStart(2, "0");

  return `${day}-${month}-${year}, ${strHours}:${minutes} ${ampm}`;
}

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

  // Sort OLDEST to NEWEST before pushing with insertRowBefore(2)
  // so that the newest ends up at row 2 (top)
  orders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  let successCount = 0;
  for (let i = 0; i < orders.length; i++) {
    const o = orders[i];
    const itemsFormatted = (o.items || [])
      .map((item) => {
        const parts = [item.name || 'Product'];
        if (item.selectedColor) parts.push(`Color: ${item.selectedColor}`);
        if (item.selectedSize) parts.push(`Size: ${item.selectedSize}`);
        return `${parts.join(', ')} (${item.quantity || 1}টি)`;
      })
      .join(' | ');

    const payload = {
      orderId: o.id,
      date: formatBangladeshiDate(o.createdAt),
      customerName: o.customerName || 'Customer',
      phone: o.phone || '',
      address: o.address || '',
      itemsText: itemsFormatted || 'N/A',
      total: o.total || 0,
      status: (o.status || 'PENDING').toUpperCase(),
      packingStatus: 'Unpacked',
      note: o.note || ''
    };

    try {
      const resp = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      await resp.text();
      successCount++;
      console.log(`[${i + 1}/${orders.length}] Synced ${o.id} (${payload.date})`);
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`Failed to sync order ${o.id}:`, err.message);
    }
  }

  console.log(`\n🎉 Successfully synced ${successCount} / ${orders.length} orders!`);
}

syncAllOrders();
