// Menjalankan kode setelah semua elemen HTML dimuat
document.addEventListener('DOMContentLoaded', function () {
	// Mengambil elemen form dan elemen-elemen statistik
	const form = document.getElementById('paymentForm');
	const transactionList = document.getElementById('transactionList');
	const totalTransactions = document.getElementById('totalTransactions');
	const totalRevenue = document.getElementById('totalRevenue');
	const avgTransaction = document.getElementById('avgTransaction');

	// Menyimpan semua transaksi dalam array
	let transactions = [];

	// Event listener ketika form dikirim
	form.addEventListener('submit', function (e) {
		e.preventDefault(); // Mencegah reload halaman saat submit

		// Ambil nilai dari form input
		const name = form.customerName.value;
		const email = form.customerEmail.value;
		const productSelect = form.productSelect;
		const product = productSelect.options[productSelect.selectedIndex].text;
		const price = parseInt(productSelect.options[productSelect.selectedIndex].getAttribute('data-price'));
		const quantity = parseInt(form.quantity.value);
		const paymentMethod = form.paymentMethod.value;
		const total = price * quantity;

		// Buat objek transaksi baru
		const newTransaction = {
			name,
			email,
			product,
			price,
			quantity,
			total,
			method: paymentMethod,
			time: new Date().toLocaleString() // Waktu transaksi
		};

		// Simpan transaksi ke array
		transactions.push(newTransaction);

		// Perbarui tampilan daftar transaksi dan statistik
		updateTransactionList(newTransaction);
		updateStats();

		// Tampilkan modal konfirmasi pembayaran
		document.getElementById('paymentModal').classList.remove('hidden');

		// Tampilkan detail transaksi pada modal
		const paymentDetails = document.getElementById('paymentDetails');
		paymentDetails.innerHTML = `
			<p><strong>Nama:</strong> ${name}</p>
			<p><strong>Email:</strong> ${email}</p>
			<p><strong>Produk:</strong> ${product}</p>
			<p><strong>Jumlah:</strong> ${quantity}</p>
			<p><strong>Total:</strong> Rp ${total.toLocaleString('id-ID')}</p>
		`;

		// Reset form setelah submit
		form.reset();
	});

	// Fungsi untuk menambahkan transaksi ke dalam daftar HTML
	function updateTransactionList(trx) {
		const template = document.getElementById('transactionTemplate');
		const clone = template.content.cloneNode(true);

		// Set data transaksi ke dalam elemen tampilan
		clone.querySelector('.transaction-customer').textContent = trx.name;
		clone.querySelector('.transaction-product').textContent = trx.product;
		clone.querySelector('.transaction-amount').textContent = `Rp ${trx.total.toLocaleString('id-ID')}`;
		clone.querySelector('.transaction-time').textContent = trx.time;
		clone.querySelector('.transaction-method').textContent = trx.method;

		// Tambahkan transaksi baru ke atas daftar
		transactionList.prepend(clone);

		// Sembunyikan tampilan "belum ada transaksi"
		const emptyState = document.getElementById('emptyState');
		if (emptyState) emptyState.classList.add('hidden');
	}

	// Fungsi untuk memperbarui statistik total, pendapatan dan rata-rata
	function updateStats() {
		const totalAmount = transactions.reduce((acc, trx) => acc + trx.total, 0);
		totalTransactions.textContent = transactions.length;
		totalRevenue.textContent = `Rp ${totalAmount.toLocaleString('id-ID')}`;
		avgTransaction.textContent = `Rp ${Math.round(totalAmount / transactions.length).toLocaleString('id-ID')}`;
	}

	// Event listener untuk menutup modal konfirmasi pembayaran
	document.getElementById('closeModalBtn').addEventListener('click', () => {
		document.getElementById('paymentModal').classList.add('hidden');
	});
});

// Tombol untuk toggle mode gelap/terang
const toggleButton = document.getElementById("toggleDarkMode");

// Inisialisasi teks saat halaman pertama kali dimuat
document.addEventListener("DOMContentLoaded", function () {
    const isDark = document.documentElement.classList.contains("dark");
    toggleButton.innerHTML = isDark ? "☀️ Mode Terang" : "🌙 Mode Gelap";
});

// Saat tombol diklik, ubah tema dan teks tombol
toggleButton.addEventListener("click", function () {
    const htmlEl = document.documentElement;
    const isDark = htmlEl.classList.toggle("dark");

    toggleButton.innerHTML = isDark ? "☀️ Mode Terang" : "🌙 Mode Gelap";
});
