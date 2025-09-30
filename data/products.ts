import { Timestamp } from "firebase/firestore";

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  category: string;
  name: string;
  price: string;
  image: string;
  images?: string[];
  sizes?: string[];
  availability?: string;
  description?: string;
  brand?: string;
  colorway?: string;
  material?: string;
  gender?: string;
  reviews?: Review[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const productsData = {
  running: [
    {
      id: "adidas-ultraboost-22-blue",
      category: "Running",
      name: "Adidas Ultraboost 22 Men's Running Shoes Blue",
      price: "RM529.00",
      image: "/images/Running/ADIDAS ULTRABOOST 22 MEN'S RUNNING SHOES BLUE.jpg",
      images: [
        "/images/Running/ADIDAS ULTRABOOST 22 MEN'S RUNNING SHOES BLUE.jpg",
        "/images/Running/ADIDAS ULTRABOOST 22 MEN'S RUNNING SHOES BLUE-2.jpg",
        "/images/Running/ADIDAS ULTRABOOST 22 MEN'S RUNNING SHOES BLUE-3.jpg",
      ],
      sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
      availability: "IN STOCK",
      description:
        "Experience ultimate comfort and energy return with the Adidas Ultraboost 22. Featuring responsive Boost midsole technology, Primeknit+ upper for adaptive fit, and Continental rubber outsole for superior traction. Perfect for daily runs and long-distance training. The iconic three-stripes design meets cutting-edge performance technology.",
      brand: "Adidas",
      colorway: "Blue/White/Core Black",
      material: "Primeknit+ upper, Boost midsole, Continental rubber outsole",
      gender: "Men",
      reviews: [
        {
          id: "r-adidas-ultraboost-1",
          productId: "adidas-ultraboost-22-blue",
          userName: "Ahmad Rahman",
          userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Amazing running shoes! The boost technology really makes a difference in comfort and energy return. Perfect for long runs.",
          date: "2024-02-15",
        },
        {
          id: "r-adidas-ultraboost-2",
          productId: "adidas-ultraboost-22-blue",
          userName: "Sarah Lee",
          userImage: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Great quality and fit. The blue colorway is stunning. Fast delivery and excellent customer service.",
          date: "2024-02-20",
        },
        {
          id: "r-adidas-ultraboost-3",
          productId: "adidas-ultraboost-22-blue",
          userName: "Marcus Johnson",
          userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment: "Comfortable shoes but took some time to break in. Overall satisfied with the purchase.",
          date: "2024-02-25",
        },
      ],
    },
    {
      id: "asics-gel-kinsei-blast-red",
      category: "Running",
      name: "Asics Gel-Kinsei Blast LE Men's Running Shoes Red",
      price: "RM449.00",
      image: "/images/Running/ASICS GEL-KINSEI BLAST LE MEN'S RUNNING SHOES RED new.png",
      images: [
        "/images/Running/ASICS GEL-KINSEI BLAST LE MEN'S RUNNING SHOES RED new.png",
        "/images/Running/ASICS GEL-KINSEI BLAST LE MEN'S RUNNING SHOES RED-2.png",
        "/images/Running/ASICS GEL-KINSEI BLAST LE MEN'S RUNNING SHOES RED-3.png",
      ],
      sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
      availability: "IN STOCK",
      description:
        "The Asics Gel-Kinsei Blast LE delivers premium cushioning and support for serious runners. Features FlyteFoam Blast+ midsole for lightweight bounce, GEL technology for shock absorption, and engineered mesh upper for breathability. Limited edition colorway with enhanced visibility features for early morning or evening runs.",
      brand: "Asics",
      colorway: "Red/Black/White",
      material: "Engineered mesh upper, FlyteFoam Blast+ midsole, GEL technology",
      gender: "Men",
      reviews: [
        {
          id: "r-asics-kinsei-1",
          productId: "asics-gel-kinsei-blast-red",
          userName: "David Tan",
          userImage: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Excellent cushioning and support. The red color is vibrant and looks great. Perfect for marathon training.",
          date: "2024-03-01",
        },
        {
          id: "r-asics-kinsei-2",
          productId: "asics-gel-kinsei-blast-red",
          userName: "Lisa Wong",
          userImage: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Best running shoes I've ever owned! The GEL technology really works. Highly recommend for serious runners.",
          date: "2024-03-05",
        },
        {
          id: "r-asics-kinsei-3",
          productId: "asics-gel-kinsei-blast-red",
          userName: "Mohamed Ali",
          userImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment: "Good quality shoes with great shock absorption. Took a few runs to break them in properly.",
          date: "2024-03-10",
        },
      ],
    },
    {
      id: "nike-pegasus-39-black",
      category: "Running",
      name: "Nike Air Zoom Pegasus 39 Men's Road Running Shoes Black",
      price: "RM389.00",
      image: "/images/Running/NIKE AIR ZOOM PEGASUS 39 MEN'S ROAD RUNNING SHOES BLACK.jpg",
      images: [
        "/images/Running/NIKE AIR ZOOM PEGASUS 39 MEN'S ROAD RUNNING SHOES BLACK.jpg",
        "/images/Running/NIKE AIR ZOOM PEGASUS 39 MEN'S ROAD RUNNING SHOES BLACK-2.jpg",
        "/images/Running/NIKE AIR ZOOM PEGASUS 39 MEN'S ROAD RUNNING SHOES BLACK-3.jpg",
      ],
      sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12", "UK 13"],
      availability: "IN STOCK",
      description:
        "The Nike Air Zoom Pegasus 39 continues its legacy as a reliable daily trainer. Features dual Air Zoom units in the forefoot and heel for responsive cushioning, breathable mesh upper, and durable rubber outsole. Perfect for daily miles, tempo runs, and long runs. A versatile workhorse for runners of all levels.",
      brand: "Nike",
      colorway: "Black/White/Anthracite",
      material: "Mesh upper, Nike Air Zoom units, Rubber outsole",
      gender: "Men",
      reviews: [
        {
          id: "r-nike-pegasus-1",
          productId: "nike-pegasus-39-black",
          userName: "Jennifer Chen",
          userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Amazing daily trainer! The Air Zoom units provide excellent responsiveness. Perfect for my morning runs.",
          date: "2024-03-12",
        },
        {
          id: "r-nike-pegasus-2",
          productId: "nike-pegasus-39-black",
          userName: "Kevin Smith",
          userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment: "Reliable and comfortable. Great value for money. The black colorway goes with everything.",
          date: "2024-03-18",
        },
        {
          id: "r-nike-pegasus-3",
          productId: "nike-pegasus-39-black",
          userName: "Fatimah Abdullah",
          userImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment: "Good running shoes for daily training. Comfortable fit and decent durability.",
          date: "2024-03-22",
        },
      ],
    },
    {
      id: "under-armour-hovr-phantom-black",
      category: "Running",
      name: "Under Armour HOVR Phantom 3 Men's Running Shoes Black",
      price: "RM469.00",
      image: "/images/Running/UNDER ARMOUR HOVR PHANTOM 3 MEN'S RUNNING SHOES BLACK.jpg",
      images: [
        "/images/Running/UNDER ARMOUR HOVR PHANTOM 3 MEN'S RUNNING SHOES BLACK.jpg",
        "/images/Running/UNDER ARMOUR HOVR PHANTOM 3 MEN'S RUNNING SHOES BLACK-2.jpg",
        "/images/Running/UNDER ARMOUR HOVR PHANTOM 3 MEN'S RUNNING SHOES BLACK-3.jpg",
      ],
      sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
      availability: "IN STOCK",
      description:
        "Experience zero-gravity feel with the Under Armour HOVR Phantom 3. Features HOVR foam for energy return and impact reduction, 3D-molded sockliner for enhanced comfort, and breathable spacer mesh upper. Connect with MapMyRun app for real-time coaching and running metrics tracking.",
      brand: "Under Armour",
      colorway: "Black/White/Pitch Gray",
      material: "Spacer mesh upper, HOVR foam midsole, 3D-molded sockliner",
      gender: "Men",
      reviews: [
        {
          id: "r-ua-hovr-1",
          productId: "under-armour-hovr-phantom-black",
          userName: "Michael Rodriguez",
          userImage: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment: "The HOVR technology is impressive! Great energy return and the app connectivity is a nice touch.",
          date: "2024-03-28",
        },
        {
          id: "r-ua-hovr-2",
          productId: "under-armour-hovr-phantom-black",
          userName: "Priya Sharma",
          userImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment: "Comfortable running shoes with good cushioning. The black design is sleek and professional.",
          date: "2024-04-02",
        },
        {
          id: "r-ua-hovr-3",
          productId: "under-armour-hovr-phantom-black",
          userName: "James Wilson",
          userImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment: "Excellent shoes for long distance running. The zero-gravity feel is real! Highly recommended.",
          date: "2024-04-08",
        },
      ],
    },
  ],
  sneakers: [
    {
      id: "nike-jordan-1-bred-toe",
      category: "Sneakers",
      name: "Nike Air Jordan 1 Low 'Bred Toe'",
      price: "RM899.00",
      image: "/images/Sneakers/bred toe.png",
      images: ["/images/Sneakers/bred toe.png", "/images/Sneakers/bred toe 2.png", "/images/Sneakers/bred toe 3.png"],
      sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
      availability: "IN STOCK",
      description:
        "The Air Jordan 1 Low 'Bred Toe' has distinctive color that was first seen on a 2018 AJ1 High release. The low-top has an all-leather upper with white quarter panels, a black forefoot overlay, a red toe box, and a coordinating red finish on the collar and heel overlay. The latter is identified by a sewn Wings emblem, while the tongue's black nylon material bears a white Jumpman logo embroidered on it. A timeless classic that bridges basketball heritage with street style.",
      brand: "Nike",
      colorway: "Black/Varsity Red/White",
      material: "Leather upper, Rubber outsole",
      gender: "Unisex",
      reviews: [
        {
          id: "r-jordan-bred-1",
          productId: "nike-jordan-1-bred-toe",
          userName: "Alex Thompson",
          userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Classic Jordan 1 silhouette with an amazing colorway. Perfect for casual wear and street style. Quality is top-notch!",
          date: "2024-04-15",
        },
        {
          id: "r-jordan-bred-2",
          productId: "nike-jordan-1-bred-toe",
          userName: "Maya Patel",
          userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Love the bred toe colorway! Comfortable fit and goes with everything. Fast shipping and authentic product.",
          date: "2024-04-20",
        },
        {
          id: "r-jordan-bred-3",
          productId: "nike-jordan-1-bred-toe",
          userName: "Ryan Baker",
          userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Timeless design that never goes out of style. Great leather quality and construction. Worth every penny!",
          date: "2024-04-25",
        },
      ],
    },
    {
      id: "nike-zoom-fly-off-white",
      category: "Sneakers",
      name: "Nike Zoom Fly x Off-White 'The Ten'",
      price: "RM3299.00",
      image: "/images/Sneakers/NIKE ZOOM FLY X OFF-WHITE THE 10.png",
      images: [
        "/images/Sneakers/NIKE ZOOM FLY X OFF-WHITE THE 10.png",
        "/images/Sneakers/NIKE ZOOM FLY X OFF-WHITE THE 10-2.png",
        "/images/Sneakers/NIKE ZOOM FLY X OFF-WHITE THE 10-3.png",
      ],
      sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
      availability: "LIMITED STOCK",
      description:
        "Part of Virgil Abloh's iconic 'The Ten' collection, this Nike Zoom Fly features deconstructed design elements, exposed foam, and Off-White's signature industrial aesthetic. Limited edition collaboration piece with unique text graphics, zip-tie, and translucent upper. A coveted collector's item that redefined sneaker culture.",
      brand: "Nike x Off-White",
      colorway: "White/Cone/Black",
      material: "Translucent upper, React foam midsole, Carbon fiber plate",
      gender: "Unisex",
      reviews: [
        {
          id: "r-offwhite-zoom-1",
          productId: "nike-zoom-fly-off-white",
          userName: "Streetwear King",
          userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Grail piece! The deconstructed design is revolutionary. Virgil's vision perfectly executed. Worth every penny for collectors.",
          date: "2024-05-01",
        },
        {
          id: "r-offwhite-zoom-2",
          productId: "nike-zoom-fly-off-white",
          userName: "Sneaker Collector",
          userImage: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Iconic collaboration! The translucent upper and exposed foam are genius. Limited edition at its finest.",
          date: "2024-05-05",
        },
        {
          id: "r-offwhite-zoom-3",
          productId: "nike-zoom-fly-off-white",
          userName: "Fashion Forward",
          userImage: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Unique design that redefined sneaker culture. Premium quality and attention to detail. A must-have piece.",
          date: "2024-05-10",
        },
      ],
    },
    {
      id: "nike-dunk-low-panda",
      category: "Sneakers",
      name: "Nike Dunk Low 'Panda'",
      price: "RM459.00",
      image: "/images/Sneakers/panda.png",
      images: ["/images/Sneakers/panda.png", "/images/Sneakers/panda-2.png", "/images/Sneakers/panda-3.png"],
      sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
      availability: "IN STOCK",
      description:
        "The Nike Dunk Low 'Panda' features a clean white leather base with black overlays, creating a timeless two-tone colorway. Premium leather construction, padded collar for comfort, and classic basketball silhouette. This versatile colorway pairs perfectly with any outfit and has become a modern streetwear staple.",
      brand: "Nike",
      colorway: "White/Black",
      material: "Leather upper, Rubber cupsole",
      gender: "Unisex",
      reviews: [
        {
          id: "r-dunk-panda-1",
          productId: "nike-dunk-low-panda",
          userName: "Classic Style",
          userImage: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Perfect colorway that goes with everything! Clean design and comfortable fit. These are my go-to everyday sneakers.",
          date: "2024-05-15",
        },
        {
          id: "r-dunk-panda-2",
          productId: "nike-dunk-low-panda",
          userName: "Minimalist Fan",
          userImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Love the simplicity of the panda colorway. Great quality leather and true to size. Highly recommended!",
          date: "2024-05-20",
        },
        {
          id: "r-dunk-panda-3",
          productId: "nike-dunk-low-panda",
          userName: "Street Casual",
          userImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment: "Solid everyday sneaker. The black and white combo is timeless. Good value for the price.",
          date: "2024-05-25",
        },
      ],
    },
  ],
  clothing: [
    {
      id: "champion-big-logo-tee",
      category: "Clothing",
      name: "Champion Big Logo Graphic Tee",
      price: "RM79.00",
      image: "/images/Clothing/CHAMPION BIG LOGO GRAPHIC TEE.png",
      images: [
        "/images/Clothing/CHAMPION BIG LOGO GRAPHIC TEE.png",
        "/images/Clothing/CHAMPION BIG LOGO GRAPHIC TEE-2.png",
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      availability: "IN STOCK",
      description:
        "Classic Champion heritage meets modern street style. Features oversized Champion logo print, premium cotton construction, and comfortable regular fit. Perfect for casual wear, layering, or athletic activities. Durable construction ensures long-lasting comfort and style.",
      brand: "Champion",
      colorway: "White/Navy",
      material: "100% Cotton",
      gender: "Unisex",
      reviews: [
        {
          id: "r-champion-logo-1",
          productId: "champion-big-logo-tee",
          userName: "Casual Comfort",
          userImage: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Great quality cotton tee! The logo print is crisp and the fit is perfect. Comfortable for daily wear.",
          date: "2024-06-01",
        },
        {
          id: "r-champion-logo-2",
          productId: "champion-big-logo-tee",
          userName: "Vintage Lover",
          userImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Love the classic Champion design! Soft fabric and true to size. Perfect for that retro athletic look.",
          date: "2024-06-05",
        },
        {
          id: "r-champion-logo-3",
          productId: "champion-big-logo-tee",
          userName: "Everyday Style",
          userImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment: "Solid basic tee with good quality. The logo adds a nice sporty touch. Good value for money.",
          date: "2024-06-10",
        },
      ],
    },
    {
      id: "champion-jersey-ringer-black",
      category: "Clothing",
      name: "Champion Classic Jersey Ringer Tee Black",
      price: "RM89.00",
      image: "/images/Clothing/CHAMPION CLASSIC JERSEY RINGER TEE BLACK.jpg",
      images: [
        "/images/Clothing/CHAMPION CLASSIC JERSEY RINGER TEE BLACK.jpg",
        "/images/Clothing/CHAMPION CLASSIC JERSEY RINGER TEE BLACK-2.jpg",
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      availability: "IN STOCK",
      description:
        "Vintage-inspired Champion jersey tee with contrasting ringer details. Soft jersey fabric blend for comfort, classic crew neck design, and iconic Champion script logo. Retro athletic aesthetic perfect for everyday wear with a timeless appeal.",
      brand: "Champion",
      colorway: "Black/White",
      material: "Cotton/Polyester blend",
      gender: "Unisex",
      reviews: [
        {
          id: "r-champion-ringer-1",
          productId: "champion-jersey-ringer-black",
          userName: "Retro Fan",
          userImage: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Love the vintage ringer style! The contrasting trim gives it a classic athletic look. Comfortable fit.",
          date: "2024-06-12",
        },
        {
          id: "r-champion-ringer-2",
          productId: "champion-jersey-ringer-black",
          userName: "Timeless Style",
          userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Perfect vintage tee! The jersey fabric is soft and the design is timeless. Fits exactly as expected.",
          date: "2024-06-15",
        },
        {
          id: "r-champion-ringer-3",
          productId: "champion-jersey-ringer-black",
          userName: "Classic Wear",
          userImage: "/images/khairul aming.jpg",
          rating: 4,
          comment:
            "Nice retro design with good quality material. The ringer details add a nice touch. Comfortable daily wear.",
          date: "2024-06-18",
        },
      ],
    },
    {
      id: "stussy-dsm-london-black",
      category: "Clothing",
      name: "Stüssy DSM London Tee Black",
      price: "RM159.00",
      image: "/images/Clothing/STÜSSY DSM LONDON TEE BLACK.png",
      images: [
        "/images/Clothing/STÜSSY DSM LONDON TEE BLACK.png",
        "/images/Clothing/STÜSSY DSM LONDON TEE BLACK-2.png",
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      availability: "LIMITED STOCK",
      description:
        "Exclusive Stüssy collaboration with Dover Street Market London. Features unique DSM London graphic print, premium cotton construction, and limited edition status. Part of the exclusive streetwear collection celebrating the iconic London store. Collector's piece for streetwear enthusiasts.",
      brand: "Stüssy",
      colorway: "Black/White",
      material: "100% Cotton",
      gender: "Unisex",
      reviews: [
        {
          id: "r-stussy-dsm-black-1",
          productId: "stussy-dsm-london-black",
          userName: "Tyler Morrison",
          userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Exclusive DSM collab is fire! Premium quality cotton and the London graphic is clean. Limited edition vibes.",
          date: "2024-07-01",
        },
        {
          id: "r-stussy-dsm-black-2",
          productId: "stussy-dsm-london-black",
          userName: "Zoe Chen",
          userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Love this collaboration! The black colorway is versatile and the fit is perfect. Stüssy quality as expected.",
          date: "2024-07-05",
        },
        {
          id: "r-stussy-dsm-black-3",
          productId: "stussy-dsm-london-black",
          userName: "Marcus Williams",
          userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment:
            "Solid streetwear piece. The DSM London print is unique and the material feels premium. Great addition to any collection.",
          date: "2024-07-10",
        },
      ],
    },
    {
      id: "stussy-dsm-london-white",
      category: "Clothing",
      name: "Stüssy DSM London Tee White",
      price: "RM159.00",
      image: "/images/Clothing/STÜSSY DSM LONDON TEE WHITE.png",
      images: [
        "/images/Clothing/STÜSSY DSM LONDON TEE WHITE.png",
        "/images/Clothing/STÜSSY DSM LONDON TEE WHITE-2.png",
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      availability: "IN STOCK",
      description:
        "Exclusive Stüssy collaboration with Dover Street Market London in clean white colorway. Features unique DSM London graphic print, premium cotton construction, and limited edition status. Perfect for those who prefer lighter tones while maintaining streetwear credibility.",
      brand: "Stüssy",
      colorway: "White/Black",
      material: "100% Cotton",
      gender: "Unisex",
      reviews: [
        {
          id: "r-stussy-dsm-white-1",
          productId: "stussy-dsm-london-white",
          userName: "Emma Johnson",
          userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Clean white colorway is perfect for summer! The DSM collaboration adds that exclusive touch. Great quality tee.",
          date: "2024-07-12",
        },
        {
          id: "r-stussy-dsm-white-2",
          productId: "stussy-dsm-london-white",
          userName: "Jake Peterson",
          userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Pristine white tee with amazing graphics! Stüssy x DSM is always a winning combo. Fits perfectly and looks fresh.",
          date: "2024-07-18",
        },
        {
          id: "r-stussy-dsm-white-3",
          productId: "stussy-dsm-london-white",
          userName: "Sophia Martinez",
          userImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment:
            "Love the minimalist approach with the white base. The London print stands out beautifully. Premium cotton feel.",
          date: "2024-07-22",
        },
      ],
    },
  ],
  sandals: [
    {
      id: "adidas-adilette-comfort-green",
      category: "Sandals",
      name: "Adidas Adilette Comfort Slides Green",
      price: "RM119.00",
      image: "/images/Sandals/ADIDAS ADILETTE COMFORT SLIDES GREEN.jpg",
      images: [
        "/images/Sandals/ADIDAS ADILETTE COMFORT SLIDES GREEN.jpg",
        "/images/Sandals/ADIDAS ADILETTE COMFORT SLIDES GREEN-2.jpg",
      ],
      sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
      availability: "IN STOCK",
      description:
        "Ultimate comfort meets iconic style with the Adidas Adilette Comfort Slides. Features Cloudfoam Plus footbed for superior cushioning, quick-dry bandage upper, and classic 3-Stripes branding. Perfect for post-workout recovery, poolside relaxation, or casual everyday wear.",
      brand: "Adidas",
      colorway: "Green/White",
      material: "Synthetic upper, Cloudfoam Plus footbed",
      gender: "Unisex",
      reviews: [
        {
          id: "r-adidas-comfort-green-1",
          productId: "adidas-adilette-comfort-green",
          userName: "Oliver Davis",
          userImage: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Most comfortable slides ever! The Cloudfoam Plus is incredible and the green color is unique. Perfect for pool days.",
          date: "2024-08-01",
        },
        {
          id: "r-adidas-comfort-green-2",
          productId: "adidas-adilette-comfort-green",
          userName: "Isabella Rodriguez",
          userImage: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Super comfy slides with great cushioning. The green colorway is fresh and different from the usual black/white options.",
          date: "2024-08-05",
        },
        {
          id: "r-adidas-comfort-green-3",
          productId: "adidas-adilette-comfort-green",
          userName: "Noah Thompson",
          userImage: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment:
            "Great quality slides for the price. The comfort level is excellent and they dry quickly after swimming.",
          date: "2024-08-10",
        },
      ],
    },
    {
      id: "adidas-adilette-sandal-classic",
      category: "Sandals",
      name: "Adidas Men's Adilette Sandal Classic",
      price: "RM99.00",
      image: "/images/Sandals/ADIDAS MEN ADILETTE SANDAL.jpg",
      images: ["/images/Sandals/ADIDAS MEN ADILETTE SANDAL.jpg", "/images/Sandals/ADIDAS MEN ADILETTE SANDAL-2.jpg"],
      sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
      availability: "IN STOCK",
      description:
        "The original Adidas slide that started it all. Classic Adilette design with synthetic upper, comfortable footbed, and durable outsole. Timeless 3-Stripes detail and comfortable slip-on design make these perfect for gym, beach, or casual wear. A wardrobe essential since 1972.",
      brand: "Adidas",
      colorway: "Navy/White",
      material: "Synthetic upper, EVA footbed",
      gender: "Men",
      reviews: [
        {
          id: "r-adidas-classic-sandal-1",
          productId: "adidas-adilette-sandal-classic",
          userName: "Ethan Brown",
          userImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Classic Adidas slides that never go out of style. Comfortable for daily wear and the navy color is clean.",
          date: "2024-08-12",
        },
        {
          id: "r-adidas-classic-sandal-2",
          productId: "adidas-adilette-sandal-classic",
          userName: "Ava Wilson",
          userImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment: "The original and still the best! Perfect for gym, beach, or just lounging around. Timeless design.",
          date: "2024-08-15",
        },
        {
          id: "r-adidas-classic-sandal-3",
          productId: "adidas-adilette-sandal-classic",
          userName: "Liam Garcia",
          userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment: "Solid everyday slides. Good value for money and the classic 3-stripes look never gets old.",
          date: "2024-08-18",
        },
      ],
    },
    {
      id: "nike-offcourt-slides-black",
      category: "Sandals",
      name: "Nike Offcourt Men's Slides Black",
      price: "RM109.00",
      image: "/images/Sandals/NIKE OFFCOURT MEN'S SLIDES BLACK.jpg",
      images: [
        "/images/Sandals/NIKE OFFCOURT MEN'S SLIDES BLACK.jpg",
        "/images/Sandals/NIKE OFFCOURT MEN'S SLIDES BLACK-2.jpg",
      ],
      sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
      availability: "IN STOCK",
      description:
        "Nike Offcourt Slides deliver comfort and style off the court. Features foam midsole for lightweight cushioning, durable synthetic leather upper, and flex grooves for natural movement. Perfect for post-game recovery or casual summer wear with classic Nike Swoosh branding.",
      brand: "Nike",
      colorway: "Black/White",
      material: "Synthetic leather upper, Foam midsole",
      gender: "Men",
      reviews: [
        {
          id: "r-nike-offcourt-black-1",
          productId: "nike-offcourt-slides-black",
          userName: "Mason Lee",
          userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Great post-workout slides! The foam cushioning is perfect for recovery and the black color is sleek.",
          date: "2024-08-20",
        },
        {
          id: "r-nike-offcourt-black-2",
          productId: "nike-offcourt-slides-black",
          userName: "Chloe Anderson",
          userImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Love these Nike slides! Super comfortable and the synthetic leather feels premium. Perfect for summer.",
          date: "2024-08-25",
        },
        {
          id: "r-nike-offcourt-black-3",
          productId: "nike-offcourt-slides-black",
          userName: "Lucas Martinez",
          userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment: "Comfortable slides with good support. The flex grooves make walking natural. Great for gym use.",
          date: "2024-08-28",
        },
      ],
    },
    {
      id: "nike-offcourt-slides-red",
      category: "Sandals",
      name: "Nike Offcourt Men's Slides Red",
      price: "RM109.00",
      image: "/images/Sandals/NIKE OFFCOURT MEN'S SLIDES RED.jpg",
      images: [
        "/images/Sandals/NIKE OFFCOURT MEN'S SLIDES RED.jpg",
        "/images/Sandals/NIKE OFFCOURT MEN'S SLIDES RED-2.jpg",
      ],
      sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
      availability: "IN STOCK",
      description:
        "Make a bold statement with Nike Offcourt Slides in vibrant red. Features the same comfort technology as the black version with foam midsole cushioning, synthetic leather upper, and flex grooves. Eye-catching colorway perfect for making a statement at the pool or gym.",
      brand: "Nike",
      colorway: "Red/White",
      material: "Synthetic leather upper, Foam midsole",
      gender: "Men",
      reviews: [
        {
          id: "r-nike-offcourt-red-1",
          productId: "nike-offcourt-slides-red",
          userName: "Harper Johnson",
          userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Bold red color that stands out! Same great comfort as the black ones but with more personality. Love them!",
          date: "2024-09-01",
        },
        {
          id: "r-nike-offcourt-red-2",
          productId: "nike-offcourt-slides-red",
          userName: "Jackson Davis",
          userImage: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment: "Vibrant red colorway is amazing! Great for making a statement at the pool. Comfort is top-notch.",
          date: "2024-09-05",
        },
        {
          id: "r-nike-offcourt-red-3",
          productId: "nike-offcourt-slides-red",
          userName: "Aria Thompson",
          userImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment:
            "Eye-catching red slides that are super comfortable. Perfect for adding some color to summer outfits.",
          date: "2024-09-08",
        },
      ],
    },
  ],
  basketball: [
    {
      id: "curry-10-iron-sharpens-iron",
      category: "Basketball",
      name: "Under Armour Curry 10 'Iron Sharpens Iron'",
      price: "RM599.00",
      image: "/images/Basketball/CURRY 10 IRON SHARPENS IRON.png",
      images: [
        "/images/Basketball/CURRY 10 IRON SHARPENS IRON.png",
        "/images/Basketball/CURRY 10 IRON SHARPENS IRON-2.png",
        "/images/Basketball/CURRY 10 IRON SHARPENS IRON-3.png",
      ],
      sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
      availability: "IN STOCK",
      description:
        "Stephen Curry's latest signature shoe featuring UA Flow cushioning technology for superior court feel and traction. Warp upper provides lightweight support and breathability. Designed for explosive cuts, quick releases, and the dynamic play style that defines modern basketball. 'Iron Sharpens Iron' colorway represents the relentless pursuit of excellence.",
      brand: "Under Armour",
      colorway: "Grey/Black/Yellow",
      material: "Warp upper, UA Flow cushioning, Rubber outsole",
      gender: "Unisex",
      reviews: [
        {
          id: "r-curry-10-iron-1",
          productId: "curry-10-iron-sharpens-iron",
          userName: "Carter Wilson",
          userImage: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Best basketball shoes I've ever played in! The UA Flow technology is incredible for court feel. Curry's signature is elite!",
          date: "2024-09-10",
        },
        {
          id: "r-curry-10-iron-2",
          productId: "curry-10-iron-sharpens-iron",
          userName: "Maya Rodriguez",
          userImage: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Amazing performance shoe! Great for quick cuts and the traction is unmatched. The colorway is fire too!",
          date: "2024-09-12",
        },
        {
          id: "r-curry-10-iron-3",
          productId: "curry-10-iron-sharpens-iron",
          userName: "Aiden Brown",
          userImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment:
            "Solid basketball shoe with excellent support. The 'Iron Sharpens Iron' theme is motivating. Great for serious players.",
          date: "2024-09-15",
        },
      ],
    },
    {
      id: "kyrie-infinity-nrg-ep",
      category: "Basketball",
      name: "Nike Kyrie Infinity NRG EP",
      price: "RM489.00",
      image: "/images/Basketball/KYRIE INFINITY NRG EP.png",
      images: [
        "/images/Basketball/KYRIE INFINITY NRG EP.png",
        "/images/Basketball/KYRIE INFINITY NRG EP-2.png",
        "/images/Basketball/KYRIE INFINITY NRG EP-3.png",
      ],
      sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
      availability: "IN STOCK",
      description:
        "Kyrie Irving's signature shoe designed for unpredictable movement and infinite creativity on the court. Features curved outsole for enhanced traction during cuts, Zoom Air cushioning for responsive feel, and lightweight construction. NRG (Energy) edition celebrates the electric playing style of one of basketball's most creative players.",
      brand: "Nike",
      colorway: "Multi-Color/Black/White",
      material: "Mesh upper, Zoom Air cushioning, Curved rubber outsole",
      gender: "Unisex",
      reviews: [
        {
          id: "r-kyrie-infinity-1",
          productId: "kyrie-infinity-nrg-ep",
          userName: "Jordan Smith",
          userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Perfect for quick cuts and unpredictable moves! The curved outsole gives amazing traction. Kyrie's best shoe yet!",
          date: "2024-09-18",
        },
        {
          id: "r-kyrie-infinity-2",
          productId: "kyrie-infinity-nrg-ep",
          userName: "Zara Martinez",
          userImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Amazing basketball shoe for guards! The colorway is vibrant and the performance is top-tier. Zoom Air feels great.",
          date: "2024-09-20",
        },
        {
          id: "r-kyrie-infinity-3",
          productId: "kyrie-infinity-nrg-ep",
          userName: "Blake Johnson",
          userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment:
            "Great for creative players who need flexibility. The lightweight design and traction are perfect for my playing style.",
          date: "2024-09-22",
        },
      ],
    },
    {
      id: "curry-warriors-jersey-2022",
      category: "Basketball",
      name: "Stephen Curry Golden State Warriors Icon Edition 2022-23",
      price: "RM249.00",
      image: "/images/Basketball/STEPHEN CURRY GOLDEN STATE WARRIORS ICON EDITION 202223.png",
      images: [
        "/images/Basketball/STEPHEN CURRY GOLDEN STATE WARRIORS ICON EDITION 202223.png",
        "/images/Basketball/STEPHEN CURRY GOLDEN STATE WARRIORS ICON EDITION 202223-2.png",
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      availability: "IN STOCK",
      description:
        "Official NBA Stephen Curry Golden State Warriors Icon Edition jersey for the 2022-23 championship season. Features Nike Dri-FIT technology for moisture management, authentic team colors and logos, and premium construction. Celebrate the Warriors dynasty with this premium basketball jersey.",
      brand: "Nike",
      colorway: "Royal Blue/Yellow/White",
      material: "Dri-FIT polyester",
      gender: "Unisex",
      reviews: [
        {
          id: "r-curry-warriors-jersey-1",
          productId: "curry-warriors-jersey-2022",
          userName: "Kai Wilson",
          userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Official championship jersey from the 2022-23 season! Quality is amazing and represents the dynasty perfectly.",
          date: "2024-09-25",
        },
        {
          id: "r-curry-warriors-jersey-2",
          productId: "curry-warriors-jersey-2022",
          userName: "Luna Garcia",
          userImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Love representing Curry and the Warriors! The Dri-FIT material is comfortable and the colors are vibrant.",
          date: "2024-09-26",
        },
        {
          id: "r-curry-warriors-jersey-3",
          productId: "curry-warriors-jersey-2022",
          userName: "Phoenix Davis",
          userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment:
            "Authentic NBA jersey with great quality. Perfect for game nights or casual wear. Warriors championship legacy!",
          date: "2024-09-27",
        },
      ],
    },
    {
      id: "wilson-nba-curry-basketball",
      category: "Basketball",
      name: "Wilson NBA Player Icon Outdoor Basketball Curry 7",
      price: "RM149.00",
      image: "/images/Basketball/WILSON NBA PLAYER ICON OUTDOOR BSKT CURRY 7.png",
      images: [
        "/images/Basketball/WILSON NBA PLAYER ICON OUTDOOR BSKT CURRY 7.png",
        "/images/Basketball/WILSON NBA PLAYER ICON OUTDOOR BSKT CURRY 7-2.png",
      ],
      sizes: ["7"],
      availability: "IN STOCK",
      description:
        "Official Wilson basketball featuring Stephen Curry player icon graphics. Designed for outdoor play with durable rubber construction, deep channel design for superior grip, and official NBA size and weight specifications. Perfect for recreational play, training, or as a collector's item for Curry fans.",
      brand: "Wilson",
      colorway: "Orange/Black/White",
      material: "Rubber construction, Deep channel design",
      gender: "Unisex",
      reviews: [
        {
          id: "r-wilson-curry-ball-1",
          productId: "wilson-nba-curry-basketball",
          userName: "River Thompson",
          userImage: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
          rating: 4.5,
          comment:
            "Great outdoor basketball with amazing grip! The Curry graphics are sick and it bounces perfectly. Love Wilson quality.",
          date: "2024-09-28",
        },
        {
          id: "r-wilson-curry-ball-2",
          productId: "wilson-nba-curry-basketball",
          userName: "Sage Martinez",
          userImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          comment:
            "Perfect for outdoor courts! Durable rubber construction and the deep channels give excellent control. Curry fan approved!",
          date: "2024-09-29",
        },
        {
          id: "r-wilson-curry-ball-3",
          productId: "wilson-nba-curry-basketball",
          userName: "Atlas Johnson",
          userImage: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
          rating: 4,
          comment:
            "Official NBA size and weight with cool Curry branding. Great for practice and pickup games. Wilson never disappoints.",
          date: "2024-09-30",
        },
      ],
    },
  ],
};

export const categoryConfig = {
  running: { title: "RUNNING", label: "Running" },
  sneakers: { title: "SNEAKERS", label: "Sneakers" },
  clothing: { title: "CLOTHING", label: "Clothing" },
  sandals: { title: "SANDALS", label: "Sandals" },
  basketball: { title: "BASKETBALL", label: "Basketball" },
};

// Helper function to get all products
export const getAllProducts = (): Product[] => {
  return Object.values(productsData).flat();
};

// Helper function to find a product by ID (now works with string IDs)
export const getProductById = (id: string): Product | undefined => {
  const allProducts = getAllProducts();
  return allProducts.find((product) => product.id === id);
};
