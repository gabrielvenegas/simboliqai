import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingGallery() {
  return (
    <div className="min-h-screen w-full p-6 md:p-12">
      <div className="relative mx-auto max-w-7xl py-16 px-4 sm:px-8 lg:px-0">
        <header className="text-center mb-20">
          <h1 className="text-5xl font-semibold text-neutral-800 mb-4">
            Gallery
          </h1>
          <p className="text-xl text-neutral-500">
            A curated display of your uniquely crafted logos
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-16">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="group">
              <Skeleton className="h-52 w-52 rounded-lg bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
