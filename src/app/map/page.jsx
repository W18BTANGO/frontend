import SimpleComponent from '@/components/SimpleComponent';

export default function Map() {
  console.log('🏠 Map page rendered');
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">NSW Suburbs Map</h1>
      <p className="text-lg mb-6">Click on any suburb to see its name. Hover over suburbs for more details.</p>
      <SimpleComponent />

    </div>
  );
}