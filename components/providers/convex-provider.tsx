"use client"

import { ReactNode } from 'react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// this provider allows us to use convex as the database and clerk as the auth provider...

export const ConvexClientProvider = ({
    children
}: {
    children: ReactNode;
}) => {
    return (
        <ClerkProvider
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        >
            <ConvexProviderWithClerk
                useAuth={useAuth}
                client={convex} //this is the const declared in line 8
            >
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}