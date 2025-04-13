const App = () => {
    const [nomeUsuario, setNomeUsuario] = React.useState('');
    const [pokemon, setPokemon] = React.useState(null);
    const [nickname, setNickname] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [sliderPokemons, setSliderPokemons] = React.useState([]);

    // Função para gerar IDs aleatórios de Pokémon
    const getRandomPokemonId = () => Math.floor(Math.random() * 898) + 1;

    // Carrega Pokémon para o slider
    React.useEffect(() => {
        const loadSliderPokemons = async () => {
            // Gera 15 IDs únicos de Pokémon
            const uniqueIds = new Set();
            while (uniqueIds.size < 15) {
                uniqueIds.add(getRandomPokemonId());
            }

            try {
                const pokemonData = await Promise.all(
                    Array.from(uniqueIds).map(id =>
                        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                            .then(res => res.json())
                            .catch(() => null) // Ignora erros
                    )
                );

                // Filtra Pokémon válidos e remove duplicatas
                const validPokemons = pokemonData.filter(p => p !== null);
                setSliderPokemons([...validPokemons, ...validPokemons]); // Duplica para o efeito de loop
            } catch (err) {
                console.error("Erro ao carregar Pokémon para slider:", err);
            }
        };

        loadSliderPokemons();
    }, []);

    // Função para gerar um nickname criativo e divertido
    const generateNickname = (username, pokemonName) => {
        if (!username) return pokemonName.toLowerCase();

        const user = username.toLowerCase().replace(/[^a-z]/g, '');
        const poke = pokemonName.toLowerCase().replace(/[^a-z]/g, '');

        // Partes dos nomes (mínimo 2 letras)
        const uFirst = user.slice(0, Math.max(2, Math.floor(user.length / 2)));
        const uLast = user.slice(-Math.max(2, Math.floor(user.length / 3)));
        const pFirst = poke.slice(0, Math.max(2, Math.floor(poke.length / 2)));
        const pLast = poke.slice(-Math.max(2, Math.floor(poke.length / 3)));

        // Elementos temáticos Pokémon (romanji)
        const pokemonPrefixes = [
            'Poke', 'Mega', 'Giga', 'Ultra', 'Shadow', 'Shiny',
            'Dark', 'Light', 'Sky', 'Metal', 'Aqua', 'Flame',
            'Thunder', 'Dragon', 'Cyber', 'Alpha', 'Omega', 'Neo'
        ];

        const pokemonSuffixes = [
            'mon', 'chu', 'zard', 'mew', 'saur', 'lite', 'ion',
            'dra', 'gon', 'tuff', 'puff', 'wing', 'tail', 'claw',
            'bite', 'storm', 'blast', 'shock', 'volt', 'flare'
        ];

        // Palavras japonesas (romanji)
        const japaneseWords = {
            prefixes: [
                'Kami', 'Ryuu', 'Kage', 'Hikari', 'Yami', 'Tsubasa',
                'Ken', 'Oh', 'Hime', 'Sora', 'Tsuki', 'Kaze'
            ],
            suffixes: [
                'noKenshi', 'noSenshi', 'noKishi', 'noTami',
                'noHime', 'noRyuu', 'noKage', 'noTsubasa'
            ]
        };

        // Símbolos em mandarim/japonês
        const asianSymbols = [
            '龍', '忍', '鬼', '神', '愛', '剣', '侍', '炎',
            '水', '風', '月', '光', '闇', '桜', '虎', '武'
        ];

        // Mapeamento de letras para números (leet speak)
        const leetMap = {
            'a': '4',
            'e': '3',
            'i': '1',
            'o': '0',
            's': '5',
            't': '7',
            'b': '8',
            'g': '9',
            'z': '2'
        };

        // Estratégias de combinação focadas em nomes
        const strategies = [
            // Estilo Pokémon tradicional
            () => `${pFirst}${uLast}`,
            () => `${uFirst}${pLast}`,

            // Com prefixos/sufixos Pokémon
            () => `${pokemonPrefixes[Math.floor(Math.random() * pokemonPrefixes.length)]}${pFirst}`,
            () => `${uFirst}${pokemonSuffixes[Math.floor(Math.random() * pokemonSuffixes.length)]}`,

            // Com elementos japoneses
            () => `${japaneseWords.prefixes[Math.floor(Math.random() * japaneseWords.prefixes.length)]}${pFirst}`,
            () => `${uFirst}${japaneseWords.suffixes[Math.floor(Math.random() * japaneseWords.suffixes.length)]}`,

            // Combinações criativas
            () => `${pFirst}${uFirst.slice(0, 2)}${pLast.slice(-1)}`,
            () => `${uFirst.slice(0, 1)}${pFirst.slice(1)}${uLast.slice(0, 1)}${pLast.slice(1, 2)}`,

            // Estilo "Pokémon + Treinador"
            () => `${pFirst}'s${uFirst}`,
            () => `${uFirst}s${pLast}`
        ];

        // Seleciona uma estratégia
        let nickname = strategies[Math.floor(Math.random() * strategies.length)]();

        // Aplica substituição de letras por números (5% de chance)
        if (Math.random() < 0.05) {
            nickname = nickname.split('').map(char => {
                const lowerChar = char.toLowerCase();
                return leetMap[lowerChar] ? leetMap[lowerChar] : char;
            }).join('');
        }

        // Capitalização padrão - primeira letra maiúscula, resto minúscula
        nickname = nickname.charAt(0).toUpperCase() + nickname.slice(1).toLowerCase();

        // Apenas 15% de chance de aplicar estilo alternativo
        if (Math.random() < 0.15) {
            // Opções de estilos alternativos
            const styles = [
                // Todas maiúsculas
                () => nickname.toUpperCase(),
                // camelCase para nomes compostos
                () => nickname.split(' ').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(''),
                // Estilo "treinador" - primeira parte maiúscula, resto minúscula
                () => {
                    const parts = nickname.split(/(?=[A-Z])/);
                    return parts.map(part =>
                        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                    ).join('');
                }
            ];

            nickname = styles[Math.floor(Math.random() * styles.length)]();
        }

        // Apenas 10% de chance de adicionar número (1-9)
        if (Math.random() < 0.1) {
            nickname += Math.floor(Math.random() * 9) + 1;
        }

        // Apenas 10% de chance de adicionar símbolo ocidental
        if (Math.random() < 0.1) {
            const symbols = ['☆', '★', '✧', '✦'];
            nickname = `${symbols[Math.floor(Math.random() * symbols.length)]}${nickname}`;
        }

        // 10% de chance de adicionar símbolo em mandarim/japonês no início ou final
        if (Math.random() < 0.1) {
            const symbol = asianSymbols[Math.floor(Math.random() * asianSymbols.length)];
            // 50% de chance de ser no início ou no final
            if (Math.random() < 0.5) {
                nickname = symbol + nickname;
            } else {
                nickname = nickname + symbol;
            }
        }

        return nickname.length > 16 ? nickname.slice(0, 16) : nickname;
    };

    const handleGerarNickname = () => {
        if (!nomeUsuario.trim()) {
            setError('Por favor, digite seu nome');
            return;
        }

        setLoading(true);
        setError(null);

        const startTime = Date.now();
        const minimumLoadTime = 2000;

        // Usa a função de ID aleatório em vez da lista fixa
        const randomId = getRandomPokemonId();

        fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
            .then(response => {
                if (!response.ok) throw new Error('Pokémon não encontrado');
                return response.json();
            })
            .then(data => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, minimumLoadTime - elapsed);

                setTimeout(() => {
                    setPokemon(data);
                    setNickname(generateNickname(nomeUsuario, data.name));
                    setLoading(false);
                }, remaining);
            })
            .catch(err => {
                console.error('Erro ao buscar Pokémon:', err);
                setError('Erro ao buscar dados do Pokémon. Tente novamente.');
                setLoading(false);
            });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(nickname);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            {/* Slider de Pokémon */}
            {loading && (
                <div className="relative overflow-hidden h-32 mb-8 bg-blue-100 rounded-xl shadow-inner">
                    <div className="pokemon-slide flex absolute top-0 left-0 h-full items-center">
                        {sliderPokemons.map((p, idx) => (
                            <div key={idx} className="flex-shrink-0 px-4">
                                <img
                                    src={p.sprites.other['official-artwork'].front_default || p.sprites.front_default}
                                    alt={p.name}
                                    className="h-24 w-24 object-contain hover:scale-110 transition-transform"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white bg-opacity-80 px-6 py-3 rounded-full shadow-lg">
                            <p className="text-xl font-semibold text-blue-600">Escolhendo seu Pokémon...</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
                    <h1 className="text-3xl font-bold text-white">Seu Nickname Pokémon</h1>
                    <p className="text-blue-100 mt-2">Descubra seu Nickname Pokémon único!</p>
                </div>

                {/* Formulário */}
                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Seu Nome
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Digite seu nome"
                                value={nomeUsuario}
                                onChange={e => setNomeUsuario(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleGerarNickname()}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <button
                            onClick={handleGerarNickname}
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} shadow-md hover:shadow-lg`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Gerando...
                                </span>
                            ) : 'Gerar Meu Nickname'}
                        </button>

                        {error && (
                            <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Resultado */}
                    {pokemon && !loading && (
                        <div className="mt-8 fade-in">
                            {/* Nickname com opção de copiar */}
                            <div className="mb-8 bg-gradient-to-r from-yellow-400 to-yellow-500 p-1 rounded-xl shadow-lg">
                                <div className="bg-white rounded-lg p-4 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-sm font-medium text-gray-500">SEU NICKNAME POKÉMON</h2>
                                        <p className="text-2xl font-bold lowercase">{nickname}</p>
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className="copy-btn relative bg-blue-100 hover:bg-blue-200 p-3 rounded-full transition-colors"
                                        title="Copiar nickname"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 copy-icon opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Frases sobre o nickname */}
                            <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                                <h3 className="text-lg font-semibold mb-3 text-gray-700">Sobre seu Nickname Pokémon:</h3>
                                <div className="space-y-2 text-gray-600">
                                    {[
                                        `"${nickname}" combina perfeitamente com ${pokemon.name}!`,
                                        `Treinadores chamados ${nickname} são conhecidos por sua coragem!`,
                                        `${nickname} é um nome lendário entre os mestres Pokémon!`,
                                        `Dizem que treinadores com o nome ${nickname} têm uma conexão especial com seu Pokémon.`,
                                        `Na região de ${['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar'][Math.floor(Math.random() * 8)]}, ${nickname} é um nome respeitado!`,
                                        `Você sabia? ${nickname} foi o nome de um campeão Pokémon em tempos antigos!`,
                                        `Com o nome ${nickname}, seu Pokémon certamente se sentirá especial!`,
                                        `"${nickname}" - um nome que ecoará nas batalhas Pokémon!`,
                                        `Lendas dizem que o nome ${nickname} traz sorte nas batalhas!`,
                                        `Na Pokédex de nomes, ${nickname} é classificado como lendário!`
                                    ][Math.floor(Math.random() * 10)]}
                                </div>
                            </div>

                            {/* Pokémon Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Imagem */}
                                <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
                                    <img
                                        src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                                        alt={pokemon.name}
                                        className="w-64 h-64 object-contain"
                                    />
                                </div>

                                {/* Detalhes */}
                                <div>
                                    <div className="flex items-center space-x-3 mb-4">
                                        <h3 className="text-2xl font-bold capitalize">{pokemon.name}</h3>
                                        <span className="text-gray-500 font-medium">#{pokemon.id.toString().padStart(3, '0')}</span>
                                    </div>

                                    {/* Tipos */}
                                    <div className="flex space-x-2 mb-4">
                                        {pokemon.types.map((typeObj, idx) => (
                                            <span
                                                key={idx}
                                                className={`type-${typeObj.type.name} px-3 py-1 rounded-full text-white text-xs font-bold capitalize`}
                                            >
                                                {typeObj.type.name}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Características */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-gray-100 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Peso</p>
                                            <p className="font-semibold">{(pokemon.weight / 10).toFixed(1)} kg</p>
                                        </div>
                                        <div className="bg-gray-100 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Altura</p>
                                            <p className="font-semibold">{(pokemon.height / 10).toFixed(1)} m</p>
                                        </div>
                                        <div className="bg-gray-100 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Experiência</p>
                                            <p className="font-semibold">{pokemon.base_experience} XP</p>
                                        </div>
                                        <div className="bg-gray-100 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Habilidades</p>
                                            <p className="font-semibold capitalize">
                                                {pokemon.abilities.slice(0, 2).map(a => a.ability.name).join(', ')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Estatísticas */}
                                    <div>
                                        <h4 className="font-medium mb-2">Estatísticas</h4>
                                        <div className="space-y-3">
                                            {pokemon.stats.map((stat, idx) => {
                                                // Tradução dos nomes das estatísticas
                                                const statNames = {
                                                    'hp': 'HP',
                                                    'attack': 'Ataque',
                                                    'defense': 'Defesa',
                                                    'special-attack': 'Atq. Especial',
                                                    'special-defense': 'Def. Especial',
                                                    'speed': 'Velocidade'
                                                };

                                                const statName = statNames[stat.stat.name] || stat.stat.name;
                                                const statValue = stat.base_stat;
                                                const percentage = Math.min(100, statValue);

                                                return (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <div className="w-20 flex-shrink-0">
                                                            <span className="text-xs font-medium text-gray-600">
                                                                {statName}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                                                                    style={{ width: `${percentage}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <div className="w-8 flex-shrink-0 text-right">
                                                            <span className="text-xs font-bold">{statValue}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Rodapé */}
            <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Feito com ❤️ usando PokéAPI | <a href="https://github.com/AlexandreZanata" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Meu GitHub</a></p>
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
