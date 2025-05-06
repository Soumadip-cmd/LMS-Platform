// src/scripts/blogSeed.js
import mongoose from 'mongoose';
import { Blog } from "./models/blog.model.js";
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://hellopreplings:4BPLlgf373nKe8Xd@preplings-cluster-dev.qeo7hc8.mongodb.net/Preplings?retryWrites=true&w=majority&appName=preplings-cluster-dev')
  .then(() => console.log('MongoDB Connected for seeding...'))
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Your two user IDs - use these to assign authors and likes
const adminUserId = new mongoose.Types.ObjectId("67ef9bc3503f36c0407fd0eb"); // Admin user
const regularUserId = new mongoose.Types.ObjectId("67ebae8bff1781a7c328d005"); // Regular user

const seedBlogs = async () => {
  try {
    // First delete existing blogs if you want to start fresh
    await Blog.deleteMany({});
    console.log('Existing blogs deleted');

    // Sample blog data
    const blogData = [
      {
        title: 'Introduction to Virtual Reality Development',
        content: `
<h1>Introduction to Virtual Reality Development</h1>

<p>Virtual Reality (VR) has transformed how we interact with digital content. From gaming to education, VR opens up new possibilities for immersive experiences.</p>

<h2>Getting Started with VR Development</h2>

<p>To start developing for VR, you'll need:</p>
<ul>
  <li>A VR headset (Oculus Quest, HTC Vive, or similar)</li>
  <li>Development software like Unity or Unreal Engine</li>
  <li>Basic understanding of 3D modeling and C# or C++ programming</li>
</ul>

<h2>Key VR Development Concepts</h2>

<h3>1. Spatial Design</h3>
<p>Creating comfortable, intuitive 3D spaces is critical for VR. Users need to navigate virtual environments naturally, with consideration for scale, movement, and interaction zones.</p>

<h3>2. Performance Optimization</h3>
<p>VR applications must maintain high frame rates (90+ FPS) to prevent motion sickness. This requires efficient coding, optimized assets, and careful scene management.</p>

<h3>3. User Interaction</h3>
<p>Designing intuitive controls that mimic real-world actions helps users adapt quickly to VR experiences. Consider hand tracking, controller input, and gaze-based interaction.</p>

<h2>Conclusion</h2>

<p>VR development combines technical skills with creative design thinking. As the technology continues to evolve, developers who understand both the possibilities and limitations of virtual reality will create the most compelling experiences.</p>
        `,
        author: adminUserId,
        category: 'VR',
        tags: ['virtual reality', 'development', 'technology', 'programming'],
        featuredImage: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        views: 342,
        likes: [regularUserId],
        comments: [
          {
            user: regularUserId,
            text: 'Great introduction! Would love to see more about optimizing VR experiences for mobile headsets.',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
          }
        ],
        isPublished: true,
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
      },
      {
        title: 'Machine Learning for Game Development',
        content: `
<h1>Machine Learning for Game Development</h1>

<p>Artificial intelligence has become a fundamental component of modern game development. Machine learning takes this a step further, allowing games to adapt and evolve based on player behavior.</p>

<h2>Applications in Gaming</h2>

<h3>Dynamic Difficulty Adjustment</h3>
<p>Machine learning can analyze player performance and adjust game difficulty in real-time, ensuring the player remains engaged without becoming frustrated.</p>

<h3>Procedural Content Generation</h3>
<p>ML algorithms can generate levels, quests, and even narratives, creating unique experiences for each playthrough while reducing development resources.</p>

<h3>NPC Behavior</h3>
<p>Non-player characters can learn from player interactions, developing more realistic and unpredictable behavior patterns that make games feel more immersive.</p>

<h2>Implementation Approaches</h2>

<h3>Supervised Learning</h3>
<p>Train your AI using labeled data from playtests, allowing it to recognize patterns in successful player experiences.</p>

<h3>Reinforcement Learning</h3>
<p>Let your AI learn through trial and error, optimizing for player engagement and satisfaction metrics.</p>

<h3>Neural Networks</h3>
<p>Implement deep learning models to handle complex pattern recognition in player behavior.</p>

<h2>Challenges and Considerations</h2>

<p>While ML offers exciting possibilities, developers must balance innovation with player experience. Excessive adaptation can make games feel unpredictable, while too little makes the ML implementation pointless.</p>

<p>Always maintain transparency with players about how their data influences the game, and consider ethical implications of behavioral analysis.</p>
        `,
        author: regularUserId,
        category: 'AI',
        tags: ['machine learning', 'game development', 'artificial intelligence'],
        featuredImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        views: 521,
        likes: [adminUserId],
        comments: [
          {
            user: adminUserId,
            text: 'I implemented a similar system in my last game project. The key is to make small, subtle adjustments so players don\'t notice the adaptation.',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
          }
        ],
        isPublished: true,
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      },
      {
        title: 'The Future of Online Education',
        content: `
<h1>The Future of Online Education</h1>

<p>The landscape of education is rapidly evolving, with technology playing an increasingly central role. Online learning platforms have demonstrated their potential to democratize education and make learning more accessible than ever before.</p>

<h2>Current Trends</h2>

<h3>Microlearning</h3>
<p>Breaking education into small, digestible segments allows learners to progress at their own pace and fit education into busy schedules.</p>

<h3>Gamification</h3>
<p>Incorporating game elements like points, badges, and leaderboards increases engagement and motivation in online courses.</p>

<h3>AI-Driven Personalization</h3>
<p>Adaptive learning systems analyze student performance and tailor content to individual needs, strengths, and weaknesses.</p>

<h2>Challenges to Address</h2>

<p>Despite rapid advancement, online education faces several key challenges:</p>

<h3>Digital Divide</h3>
<p>Not all students have equal access to technology and high-speed internet, creating barriers to participation.</p>

<h3>Assessment Integrity</h3>
<p>Ensuring the authenticity of online assessments remains difficult, requiring innovative approaches to verification.</p>

<h3>Social Development</h3>
<p>The social aspects of education - collaboration, discussion, and networking - are more difficult to replicate in virtual environments.</p>

<h2>Looking Ahead</h2>

<p>The most successful educational platforms will likely blend the convenience of online learning with the benefits of traditional education. Hybrid models, immersive technologies like VR/AR, and community-focused approaches will define the next generation of educational experiences.</p>
        `,
        author: adminUserId,
        category: 'Education',
        tags: ['online learning', 'edtech', 'future of education'],
        featuredImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        views: 287,
        likes: [regularUserId],
        comments: [
          {
            user: regularUserId,
            text: 'As someone working in education technology, I believe VR will be the next big breakthrough for experiential learning.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          }
        ],
        isPublished: true,
        publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
      },
      {
        title: 'Building Real-time Multiplayer Games with WebSockets',
        content: `
<h1>Building Real-time Multiplayer Games with WebSockets</h1>

<p>Creating responsive multiplayer experiences requires efficient communication between clients and servers. WebSockets provide a perfect solution for real-time data exchange in web-based games.</p>

<h2>Why WebSockets?</h2>

<p>Unlike traditional HTTP requests, WebSockets maintain a persistent connection between client and server, allowing for:</p>
<ul>
  <li>Low-latency communication</li>
  <li>Bidirectional data flow</li>
  <li>Reduced overhead compared to polling</li>
</ul>

<h2>Implementation Basics</h2>

<h3>Server Setup</h3>

<p>Using Node.js with the ws or Socket.IO library:</p>

<pre><code>const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    // Process game state updates
  });

  ws.send('Connected to game server');
});
</code></pre>

<h3>Client Integration</h3>

<pre><code>const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function() {
  console.log('Connected to server');
};

socket.onmessage = function(event) {
  const gameUpdate = JSON.parse(event.data);
  updateGameState(gameUpdate);
};

function sendPlayerAction(action) {
  socket.send(JSON.stringify(action));
}
</code></pre>

<h2>Handling Game State</h2>

<p>For multiplayer games, consider implementing:</p>

<ol>
  <li><strong>State synchronization</strong> - Regularly synchronize game state across all clients</li>
  <li><strong>Input prediction</strong> - Predict player actions locally to reduce perceived latency</li>
  <li><strong>Interpolation</strong> - Smooth movement between state updates</li>
  <li><strong>Conflict resolution</strong> - Handle contradictory actions from multiple players</li>
</ol>

<h2>Scaling Considerations</h2>

<p>As your player base grows, you'll need strategies for:</p>
<ul>
  <li>Load balancing across multiple servers</li>
  <li>Game session management</li>
  <li>Handling disconnections gracefully</li>
  <li>Regional server deployment to minimize latency</li>
</ul>
        `,
        author: regularUserId,
        category: 'Gaming',
        tags: ['websockets', 'multiplayer', 'game development', 'real-time'],
        featuredImage: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        views: 413,
        likes: [adminUserId],
        comments: [
          {
            user: adminUserId,
            text: 'Great explanation! I would add that for more complex games, consider a hybrid approach with both WebSockets and HTTP for different types of game data.',
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
          }
        ],
        isPublished: true,
        publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) // 12 days ago
      },
      {
        title: 'Optimizing React Applications for Performance',
        content: `
<h1>Optimizing React Applications for Performance</h1>

<p>React offers exceptional developer experience, but without proper optimization, complex applications can suffer from performance issues. This guide covers key strategies for maximizing React performance.</p>

<h2>Identifying Performance Issues</h2>

<p>Before optimizing, identify bottlenecks using:</p>
<ul>
  <li>React DevTools Profiler</li>
  <li>Chrome Performance tab</li>
  <li>Lighthouse audits</li>
</ul>

<p>Focus on components that render frequently or process large amounts of data.</p>

<h2>Key Optimization Techniques</h2>

<h3>1. Prevent Unnecessary Re-renders</h3>

<p>Use React.memo for functional components:</p>

<pre><code>const MemoizedComponent = React.memo(MyComponent, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render)
  // Return false if props are different (allow re-render)
});
</code></pre>

<p>For class components, extend PureComponent or implement shouldComponentUpdate.</p>

<h3>2. Code Splitting</h3>

<p>Break your bundle into smaller chunks loaded on demand:</p>

<pre><code>const LazyComponent = React.lazy(() => import('./LazyComponent'));

function MyComponent() {
  return (
    <React.Suspense fallback={<Loading />}>
      <LazyComponent />
    </React.Suspense>
  );
}
</code></pre>

<h3>3. Virtualize Long Lists</h3>

<p>When rendering long lists, only render items visible in the viewport:</p>

<pre><code>import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={500}
      width={300}
      itemCount={items.length}
      itemSize={35}
    >
      {Row}
    </FixedSizeList>
  );
}
</code></pre>

<h3>4. Memoize Expensive Calculations</h3>

<p>Use useMemo to cache results of costly functions:</p>

<pre><code>const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
</code></pre>

<h2>State Management Considerations</h2>

<p>For large applications, consider:</p>
<ul>
  <li>Using context API efficiently</li>
  <li>Implementing Redux with selectors</li>
  <li>Exploring alternatives like Recoil or Jotai for atomic state</li>
</ul>
        `,
        author: adminUserId,
        category: 'Technology',
        tags: ['react', 'performance', 'web development', 'optimization'],
        featuredImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        views: 678,
        likes: [regularUserId],
        comments: [
          {
            user: regularUserId,
            text: 'The useMemo tip alone dramatically improved our dashboard performance. Great advice!',
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
          }
        ],
        isPublished: true,
        publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) // 9 days ago
      },
      {
        title: 'Designing Effective Augmented Reality Experiences',
        content: `
<h1>Designing Effective Augmented Reality Experiences</h1>

<p>Augmented Reality (AR) merges digital elements with the physical world, creating interactive experiences that enhance our perception of reality. Designing for AR requires understanding both technical constraints and human perception.</p>

<h2>Design Principles for AR</h2>

<h3>Spatial Awareness</h3>

<p>AR experiences must respect the physical space where they operate:</p>
<ul>
  <li>Respect real-world objects and obstacles</li>
  <li>Provide appropriate scale and perspective</li>
  <li>Consider lighting conditions for realistic integration</li>
</ul>

<h3>Intuitive Interactions</h3>

<p>Users are still developing "AR literacy" - design with familiarity in mind:</p>
<ul>
  <li>Use recognizable gestures like tap, pinch, and drag</li>
  <li>Provide clear visual cues for interactive elements</li>
  <li>Minimize the learning curve for new interactions</li>
</ul>

<h3>Contextual Relevance</h3>

<p>Successful AR experiences deliver value by enhancing the real world:</p>
<ul>
  <li>Provide information relevant to the user's location or activity</li>
  <li>Solve real problems rather than creating novelty</li>
  <li>Consider the social context of use (public vs. private spaces)</li>
</ul>

<h2>Technical Considerations</h2>

<h3>Device Capabilities</h3>

<p>Design with awareness of hardware limitations:</p>
<ul>
  <li>Field of view (typically narrower than expected)</li>
  <li>Tracking stability and environmental recognition</li>
  <li>Processing power and battery constraints</li>
</ul>

<h3>Environmental Factors</h3>

<p>AR experiences operate in unpredictable environments:</p>
<ul>
  <li>Design for variable lighting conditions</li>
  <li>Consider different surface types and textures</li>
  <li>Plan for interruptions and context switching</li>
</ul>

<h2>Testing and Iteration</h2>

<p>Prototype early and often:</p>
<ul>
  <li>Test in various physical environments</li>
  <li>Gather feedback on comfort and usability</li>
  <li>Iterate based on real-world usage patterns</li>
</ul>

<h2>Case Studies</h2>

<h3>Education</h3>
<p>AR anatomy applications allow students to explore complex biological systems in 3D, improving comprehension and retention.</p>

<h3>Retail</h3>
<p>Virtual try-on experiences for clothing, makeup, and furniture reduce return rates and increase customer confidence.</p>

<h3>Navigation</h3>
<p>AR wayfinding overlays directional guidance onto the real world, simplifying complex navigation tasks in unfamiliar environments.</p>
        `,
        author: regularUserId,
        category: 'VR',
        tags: ['augmented reality', 'ar', 'ux design', 'interaction design'],
        featuredImage: 'https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        views: 329,
        likes: [adminUserId],
        comments: [
          {
            user: adminUserId,
            text: 'I work in industrial AR applications, and these principles apply perfectly. Would add that reliability is even more critical in professional contexts.',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
          }
        ],
        isPublished: true,
        publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
      },
      {
        title: 'Understanding Generative Adversarial Networks (GANs)',
        content: `
<h1>Understanding Generative Adversarial Networks (GANs)</h1>

<p>Generative Adversarial Networks represent one of the most innovative approaches to AI in recent years. These systems consist of two neural networks competing against each other, resulting in the generation of remarkably realistic content.</p>

<h2>How GANs Work</h2>

<p>At their core, GANs involve two components:</p>

<h3>The Generator</h3>

<p>This neural network creates content (images, text, etc.) by transforming random noise into structured data. Its goal is to produce outputs indistinguishable from real data.</p>

<h3>The Discriminator</h3>

<p>This network evaluates content, trying to distinguish between real data and the generator's creations. It acts as a critic, providing feedback to improve the generator.</p>

<p>The two networks engage in a minimax game - as the discriminator improves at detecting fake content, the generator must evolve to create more convincing outputs.</p>

<h2>GAN Architectures</h2>

<p>Several specialized GAN architectures have emerged:</p>

<h3>StyleGAN</h3>
<p>Offers control over specific visual features through style transfer techniques, enabling fine-grained manipulation of generated images.</p>

<h3>CycleGAN</h3>
<p>Enables unpaired image-to-image translation, learning to convert between domains (e.g., horses to zebras) without requiring paired examples.</p>

<h3>StackGAN</h3>
<p>Creates high-resolution images in multiple stages, first generating basic shapes and then adding details.</p>

<h2>Applications</h2>

<p>GANs have found application across numerous domains:</p>

<h3>Art and Design</h3>
<p>Creating original artwork, fashion designs, and architectural concepts.</p>

<h3>Content Creation</h3>
<p>Generating realistic images for advertising, game development, and film production.</p>

<h3>Data Augmentation</h3>
<p>Expanding limited datasets for training other machine learning models.</p>

<h3>Scientific Research</h3>
<p>Generating molecular structures for drug discovery or simulating physics experiments.</p>

<h2>Ethical Considerations</h2>

<p>The power of GANs raises important ethical questions:</p>

<h3>Deepfakes</h3>
<p>GANs can create convincing fake images or videos of real people, raising concerns about misinformation.</p>

<h3>Copyright and Ownership</h3>
<p>When AI generates content based on existing works, questions arise about intellectual property rights.</p>

<h3>Bias Amplification</h3>
<p>GANs trained on biased datasets may amplify those biases in their generated content.</p>
        `,
        author: adminUserId,
        category: 'AI',
        tags: ['machine learning', 'GANs', 'neural networks', 'generative ai'],
        featuredImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        views: 502,
        likes: [regularUserId],
        comments: [
          {
            user: regularUserId,
            text: 'I\'ve been experimenting with StyleGAN for character design. The results are impressive but still require significant human curation.',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
          }
        ],
        isPublished: true,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        title: 'The Rise of Cloud Gaming Platforms',
        content: `
<h1>The Rise of Cloud Gaming Platforms</h1>

<p>Cloud gaming represents a fundamental shift in how games are distributed and played, moving processing from local hardware to remote servers and streaming the results to players' devices.</p>

<h2>How Cloud Gaming Works</h2>

<p>Unlike traditional gaming, which requires powerful local hardware, cloud gaming:</p>
<ul>
  <li>Runs games on remote servers with high-end components</li>
  <li>Streams video and audio to the player's device</li>
  <li>Sends player inputs back to the server</li>
  <li>Eliminates downloading, installation, and hardware requirements</li>
</ul>

<h2>Major Platforms</h2>

<p>The cloud gaming market has seen rapid growth with several key players:</p>

<h3>Google Stadia</h3>
<p>Google's entry offers integration with YouTube and play across multiple devices, though its future remains uncertain after recent strategic shifts.</p>

<h3>NVIDIA GeForce Now</h3>
<p>Allows players to access their existing game libraries from Steam, Epic Games Store, and other platforms, focusing on PC gaming.</p>

<h3>Xbox Cloud Gaming</h3>
<p>Microsoft's service integrates with Game Pass, offering a subscription model with access to hundreds of titles across multiple devices.</p>

<h3>Amazon Luna</h3>
<p>Amazon's platform emphasizes channel-based subscriptions, allowing publishers to offer their own curated collections.</p>

<h2>Technical Challenges</h2>

<p>Despite significant advances, cloud gaming faces several hurdles:</p>

<h3>Latency</h3>
<p>Even minor input delay can significantly impact gaming experience, especially in competitive or fast-paced titles.</p>

<h3>Bandwidth Requirements</h3>
<p>High-quality streaming demands substantial internet speed, typically 10-35 Mbps for 1080p gaming.</p>

<h3>Visual Quality</h3>
<p>Compression artifacts and reduced resolution can affect graphical fidelity compared to local hardware.</p>

<h2>The Future Landscape</h2>

<p>As technology improves, cloud gaming is likely to:</p>
<ul>
  <li>Expand access to high-end gaming experiences on low-end devices</li>
  <li>Enable new game designs that leverage server-side computing</li>
  <li>Shift business models toward subscription services</li>
  <li>Integrate with other cloud services and entertainment platforms</li>
</ul>

<p>The industry is still evolving, with ongoing innovation addressing current limitations and expanding possibilities for both players and developers.</p>
        `,
        author: regularUserId,
        category: 'Gaming',
        tags: ['cloud gaming', 'game streaming', 'stadia', 'xbox cloud'],
        featuredImage: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        views: 385,
        likes: [adminUserId],
        comments: [
          {
            user: adminUserId,
            text: 'I\'ve tried most of these services, and while the technology is promising, internet infrastructure remains the biggest limitation for widespread adoption.',
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
          }
        ],
        isPublished: true,
        publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
      }
    ];

    // Insert blogs
    const insertedBlogs = await Blog.insertMany(blogData);
    console.log(`${insertedBlogs.length} blogs successfully inserted`);
    
    // Log the inserted blog IDs for reference
    console.log('Inserted Blog IDs:');
    insertedBlogs.forEach(blog => {
      console.log(`${blog.title}: ${blog._id}`);
    });

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedBlogs();