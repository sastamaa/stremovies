const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const manifest = {
  id: "example.stremio-addon",
  version: "1.0.0",
  name: "My Movie & Series Add-on with Streams",
  description: "An add-on providing custom movies, series, and streaming links",
  resources: ["catalog", "meta", "stream"],
  types: ["movie", "series"],
  catalogs: [
    {
      type: "movie",
      id: "my-movie-catalog",
      name: "My Movies"
    },
    {
      type: "series",
      id: "my-series-catalog",
      name: "My Series"
    }
  ]
};

const builder = new addonBuilder(manifest);

// List of movies
const movies = [
  {
    id: "tt0111161",
    type: "movie",
    name: "The Shawshank Redemption",
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
  },
  {
    id: "tt0068646",
    type: "movie",
    name: "The Godfather",
    poster: "https://image.tmdb.org/t/p/w500/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg"
  }
];

// List of series
const series = [
  {
    id: "tt0903747",
    type: "series",
    name: "Breaking Bad",
    poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg"
  },
  {
    id: "tt0944947",
    type: "series",
    name: "Game of Thrones",
    poster: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg"
  }
];

// Streaming links
const streams = {
  tt0111161: [
    {
      title: "HD Stream",
      url: "https://example.com/streams/shawshank.mp4"
    },
    {
      title: "Backup Stream",
      url: "https://example.com/backup/shawshank.mp4"
    }
  ],
  tt0068646: [
    {
      title: "Main Stream",
      url: "https://example.com/streams/godfather.mp4"
    }
  ],
  tt0903747: [
    {
      title: "Season 1, Episode 1",
      url: "https://example.com/streams/breakingbad_s1e1.mp4"
    }
  ],
  tt0944947: [
    {
      title: "Season 1, Episode 1",
      url: "https://example.com/streams/got_s1e1.mp4"
    }
  ]
};

// Catalog handlers
builder.defineCatalogHandler(({ type, id }) => {
  if (type === "movie" && id === "my-movie-catalog") {
    return Promise.resolve({ metas: movies });
  } else if (type === "series" && id === "my-series-catalog") {
    return Promise.resolve({ metas: series });
  }
  return Promise.resolve({ metas: [] });
});

// Metadata handler
builder.defineMetaHandler(({ type, id }) => {
  const allContent = [...movies, ...series];
  const meta = allContent.find(item => item.id === id);
  if (meta) {
    return Promise.resolve({ meta });
  }
  return Promise.reject({ error: "Meta not found" });
});

// Stream handler
builder.defineStreamHandler(({ type, id }) => {
  if (streams[id]) {
    return Promise.resolve({ streams: streams[id] });
  }
  return Promise.resolve({ streams: [] });
});

// Start server
serveHTTP(builder, { port: 7000 });
console.log("Add-on running at: http://localhost:7000/manifest.json");
