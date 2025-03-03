import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Champion {
  id: string;
  name: string;
  rank: number;
  competition: string;
  image: {
    url: string;
    alternativeText?: string;
  };
}

interface ChampionsFilterProps {
  saturdayChili: Champion[];
  limitedShow: Champion[];
  openShow: Champion[];
}

function ordinalSuffixOf(i: number): string {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) return i + 'st';
  if (j === 2 && k !== 12) return i + 'nd';
  if (j === 3 && k !== 13) return i + 'rd';
  return i + 'th';
}

function ChampionCard({ winner }: { winner: Champion }) {
  const ranking = ordinalSuffixOf(winner.rank);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="aspect-square mb-4 overflow-hidden rounded-md">
          <img
            src={winner.image.url}
            alt={`${winner.name}, ${ranking} Place, ${winner.competition}`}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        </div>
        <div className="space-y-1 text-center">
          <p className="text-sm text-muted-foreground">{ranking} Place</p>
          <h3 className="font-semibold text-foreground">{winner.name}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ChampionsFilter({
  saturdayChili,
  limitedShow,
  openShow,
}: ChampionsFilterProps) {
  const events = [
    {
      value: 'saturday',
      label: 'Saturday Chili',
      champions: saturdayChili,
    },
    {
      value: 'limited',
      label: 'Limited Show',
      champions: limitedShow,
    },
    {
      value: 'open',
      label: 'Open Show',
      champions: openShow,
    },
  ];

  return (
    <Tabs defaultValue="saturday" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {events.map((event) => (
          <TabsTrigger key={event.value} value={event.value}>
            {event.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {events.map((event) => (
        <TabsContent key={event.value} value={event.value} className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {event.champions.map((champion) => (
              <ChampionCard key={champion.id} winner={champion} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
