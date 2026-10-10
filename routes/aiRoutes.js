const express = require("express");

const Salon = require("../models/Salon");
const Service = require("../models/Service");
const Review = require("../models/Review");

const router = express.Router();

router.post("/chat", async function (req, res) {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        message: "Mesaj boş olamaz.",
      });
    }

    const message = userMessage.toLowerCase();

    const salons = await Salon.find().sort({
      rating: -1,
      reviewCount: -1,
    });

    const services = await Service.find();
    const reviews = await Review.find();

    let answer = "";

    const bestSalon = salons.length > 0 ? salons[0] : null;

    /* 1. Selamlama */
    if (
      message === "merhaba" ||
      message === "selam" ||
      message === "hello" ||
      message === "hi" ||
      message.startsWith("merhaba ") ||
      message.startsWith("selam ")
    ) {
      answer =
        "Merhaba, ben Akıllı Kuaför Asistanı. Size salon önerisi, hizmet önerisi, randevu alma, değerlendirme ve salon bilgileri konusunda yardımcı olabilirim.";
    } else if (
      /* 2. Saç bakımı / yıpranmış saç */
      message.includes("yıprandı") ||
      message.includes("yiprandı") ||
      message.includes("kırık") ||
      message.includes("kirik") ||
      message.includes("saçım kötü") ||
      message.includes("saç bakım") ||
      message.includes("keratin") ||
      message.includes("saçlarım kuru")
    ) {
      answer =
        "Saçlarınız yıpranmış veya kuruysa saç bakımı, keratin bakımı ya da onarıcı bakım hizmetlerini tercih edebilirsiniz. Bu hizmetler saçın daha sağlıklı, parlak ve canlı görünmesine yardımcı olur.";
    } else if (
      /* 3. Saç kesimi / model önerisi */
      message.includes("saç modeli") ||
      message.includes("sac modeli") ||
      message.includes("model öner") ||
      message.includes("model oneri") ||
      message.includes("saç kestirmek") ||
      message.includes("saç kesimi") ||
      message.includes("kesim") ||
      message.includes("kısa saç") ||
      message.includes("uzun saç") ||
      message.includes("kahkül") ||
      message.includes("katlı kesim")
    ) {
      answer =
        "Saç modeli seçimi yüz şeklinize ve saç tipinize göre değişir. Genel olarak doğal bir görünüm için katlı kesim, daha modern bir görünüm için kısa bob kesim, küçük değişiklik isteyenler için ise uçlardan kesim veya kahkül tercih edilebilir. Detaylı model için kuaför salonundaki saç kesimi hizmetini seçebilirsiniz.";
    } else if (
      /* 4. Boya / renk */
      message.includes("boya") ||
      message.includes("renk") ||
      message.includes("ombre") ||
      message.includes("balayage") ||
      message.includes("röfle") ||
      message.includes("sarı saç") ||
      message.includes("kahverengi")
    ) {
      answer =
        "Saç renginizi değiştirmek istiyorsanız saç boyama, ombre, balyaj veya röfle hizmetlerini tercih edebilirsiniz. Doğal bir değişim için balyaj, daha belirgin bir değişim için saç boyama daha uygun olabilir.";
    } else if (
      /* 5. Cilt bakımı */
      message.includes("cilt") ||
      message.includes("solgun") ||
      message.includes("sivilce") ||
      message.includes("yüz") ||
      message.includes("leke") ||
      message.includes("siyah nokta") ||
      message.includes("cildim")
    ) {
      answer =
        "Cildiniz solgun, lekeli veya bakıma ihtiyaç duyuyorsa cilt bakımı hizmeti sizin için uygun olabilir. Cilt bakımı, cildin daha temiz, canlı ve parlak görünmesine yardımcı olur.";
    } else if (
      /* 6. Makyaj / özel gün */
      message.includes("davet") ||
      message.includes("özel gün") ||
      message.includes("ozel gun") ||
      message.includes("nişan") ||
      message.includes("nisan") ||
      message.includes("düğün") ||
      message.includes("dugun") ||
      message.includes("mezuniyet") ||
      message.includes("makyaj") ||
      message.includes("gece")
    ) {
      answer =
        "Özel günler için profesyonel makyaj ve saç tasarımı hizmetlerini tercih edebilirsiniz. Düğün, nişan, mezuniyet veya davet gibi etkinliklerde bu hizmetler daha şık ve düzenli görünmenize yardımcı olur.";
    } else if (
      /* 7. Kaş / manikür / pedikür */
      message.includes("kaş") ||
      message.includes("kas") ||
      message.includes("tırnak") ||
      message.includes("tirnak") ||
      message.includes("manikür") ||
      message.includes("manikur") ||
      message.includes("pedikür") ||
      message.includes("pedikur") ||
      message.includes("oje")
    ) {
      answer =
        "El, ayak ve kaş bakımı için manikür, pedikür, kaş tasarımı veya oje hizmetlerini tercih edebilirsiniz. Daha bakımlı bir görünüm için bu hizmetler uygundur.";
    } else if (
      /* 8. Salon önerisi genel */
      message.includes("salon öner") ||
      message.includes("salon oner") ||
      message.includes("hangi salon") ||
      message.includes("en iyi salon") ||
      message.includes("iyi salon") ||
      message.includes("bana salon") ||
      message.includes("tercih et") ||
      message.includes("önerir misin") ||
      message.includes("onerir misin")
    ) {
      if (!bestSalon) {
        answer = "Şu anda sistemde kayıtlı salon bulunmuyor.";
      } else {
        answer =
          bestSalon.district +
          " bölgesinde " +
          bestSalon.name +
          " salonunu önerebilirim. Salonun puanı " +
          bestSalon.rating +
          " ve toplam " +
          bestSalon.reviewCount +
          " değerlendirmesi bulunmaktadır. Detay sayfasından hizmetleri inceleyip randevu alabilirsiniz.";
      }
    } else if (
      /* 9. İlçeye göre salon önerisi */
      message.includes("selçuklu") ||
      message.includes("selcuklu") ||
      message.includes("meram") ||
      message.includes("karatay")
    ) {
      let districtName = "";

      if (message.includes("selçuklu") || message.includes("selcuklu")) {
        districtName = "Selçuklu";
      } else if (message.includes("meram")) {
        districtName = "Meram";
      } else if (message.includes("karatay")) {
        districtName = "Karatay";
      }

      const districtSalons = salons.filter(function (salon) {
        return salon.district.toLowerCase() === districtName.toLowerCase();
      });

      if (districtSalons.length === 0) {
        answer = districtName + " ilçesinde kayıtlı salon bulunamadı.";
      } else {
        const selectedSalon = districtSalons[0];

        answer =
          districtName +
          " ilçesinde " +
          selectedSalon.name +
          " salonunu önerebilirim. Puanı " +
          selectedSalon.rating +
          " ve değerlendirme sayısı " +
          selectedSalon.reviewCount +
          ". Detay sayfasından hizmetlerini inceleyebilirsiniz.";
      }
    } else if (
      /* 10. Randevu nasıl alınır */
      message.includes("randevu nasıl") ||
      message.includes("randevu al") ||
      message.includes("randevu almak") ||
      message.includes("nasıl randevu") ||
      message.includes("rezervasyon")
    ) {
      answer =
        "Randevu almak için önce Salonlar sayfasından bir salon seçmelisiniz. Daha sonra salon detay sayfasındaki 'Randevu Al' butonuna tıklayıp hizmet, tarih ve saat seçerek randevunuzu oluşturabilirsiniz.";
    } else if (
      /* 11. Randevularımı nerede görürüm */
      message.includes("randevularımı") ||
      message.includes("randevularim") ||
      message.includes("randevumu nerede") ||
      message.includes("randevu durum") ||
      message.includes("durumunu")
    ) {
      answer =
        "Randevularınızı Müşteri Paneli içerisindeki 'Randevularım' bölümünden görebilirsiniz. Burada randevunuzun beklemede, onaylandı veya reddedildi durumunu takip edebilirsiniz.";
    } else if (
      /* 12. Randevu iptali */
      message.includes("iptal") ||
      message.includes("randevumu sil") ||
      message.includes("randevu iptal")
    ) {
      answer =
        "Şu an sistemde randevu iptal işlemi aktif değilse, salonla iletişime geçmeniz gerekir. Geliştirme olarak müşteri paneline randevu iptal butonu eklenebilir.";
    } else if (
      /* 13. Owner işlemleri */
      message.includes("salon sahibi") ||
      message.includes("randevu onay") ||
      message.includes("randevu reddet") ||
      message.includes("hizmet ekle") ||
      message.includes("hizmet sil")
    ) {
      answer =
        "Salon sahibi panelinde salon bilgileri düzenlenebilir, hizmet eklenebilir veya silinebilir. Ayrıca gelen randevular onaylanabilir ya da reddedilebilir.";
    } else if (
      /* 14. Admin işlemleri */
      message.includes("admin") ||
      message.includes("yönetici") ||
      message.includes("yonetici") ||
      message.includes("kullanıcılar") ||
      message.includes("mesajlar")
    ) {
      answer =
        "Admin panelinde toplam kullanıcı, salon, randevu ve iletişim mesajları görüntülenebilir. Ayrıca kullanıcılar, son randevular ve iletişim mesajları takip edilebilir.";
    } else if (
      /* 15. Yorum / değerlendirme */
      message.includes("yorum") ||
      message.includes("değerlendirme") ||
      message.includes("degerlendirme") ||
      message.includes("puan") ||
      message.includes("yıldız") ||
      message.includes("yildiz")
    ) {
      if (reviews.length === 0) {
        answer =
          "Şu anda yorum özeti oluşturmak için yeterli değerlendirme bulunmuyor.";
      } else {
        answer =
          "Kullanıcı yorumları salon seçiminde önemli bir etkendir. Yüksek puanlı ve daha fazla değerlendirmesi olan salonları tercih etmek daha güvenli bir seçim yapmanıza yardımcı olur.";
      }
    } else if (
      /* 16. Fiyat / ücret */
      message.includes("fiyat") ||
      message.includes("ücret") ||
      message.includes("ucret") ||
      message.includes("kaç tl") ||
      message.includes("ne kadar")
    ) {
      if (services.length === 0) {
        answer = "Şu anda sistemde hizmet fiyatı bilgisi bulunmuyor.";
      } else {
        answer =
          "Hizmet fiyatları salona ve seçilen hizmete göre değişmektedir. Salon detay sayfasındaki Hizmetlerimiz bölümünden hizmet adı, fiyat ve süre bilgilerini görebilirsiniz.";
      }
    } else if (
      /* 17. Saat / uygunluk */
      message.includes("saat") ||
      message.includes("uygun saat") ||
      message.includes("bugün") ||
      message.includes("yarın") ||
      message.includes("musait") ||
      message.includes("müsait")
    ) {
      answer =
        "Randevu sayfasında uygun saatlerden birini seçebilirsiniz. Sistemde örnek saatler 10:00, 11:00, 12:00, 14:00, 15:00 ve 16:00 olarak gösterilmektedir.";
    } else if (
      /* 18. Genel hizmet önerisi */
      message.includes("hizmet") ||
      message.includes("ne yaptırmalıyım") ||
      message.includes("ne yaptirmaliyim") ||
      message.includes("öner") ||
      message.includes("oner")
    ) {
      answer =
        "İhtiyacınıza göre hizmet seçebilirsiniz. Saçlarınız yıprandıysa saç bakımı, özel gün için hazırlanıyorsanız makyaj ve saç tasarımı, cilt için ise cilt bakımı hizmeti uygun olabilir.";
    } else {
      /* 19. Varsayılan cevap */
      answer =
        "Size yardımcı olabilmem için salon, hizmet, randevu, fiyat, yorum veya kullanıcı paneli hakkında soru sorabilirsiniz. Örneğin: 'Selçuklu'da salon öner', 'Saçlarım yıprandı hangi hizmeti almalıyım?' veya 'Randevumu nerede görebilirim?' diye sorabilirsiniz.";
    }

    res.status(200).json({
      answer: answer,
    });
  } catch (error) {
    res.status(500).json({
      message: "AI asistan cevap verirken hata oluştu.",
      error: error.message,
    });
  }
});

router.get("/test", function (req, res) {
  res.status(200).json({
    answer: "AI asistan API çalışıyor.",
  });
});

module.exports = router;
