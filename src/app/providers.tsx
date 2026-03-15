'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    // Usamos useState para crear el QueryClient solo una vez por ciclo de vida del componente.
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: { queries: { staleTime: 5 * 1000 } },
            }),
    );

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}