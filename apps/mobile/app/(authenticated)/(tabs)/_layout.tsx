import { authClient } from "@/auth/client";
import { LoadingScreen } from "@/components/loading-screen";
import { Redirect } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";

export default function TabLayout() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <LoadingScreen message="Loading..." />;
  }

  if (!session) {
    return <Redirect href="/(unauthenticated)/login" />;
  }

  return (
    <NativeTabs>
      <NativeTabs.Trigger>
        <Label>Home</Label>
        <Icon sf="house" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger>
        <Label>Discover</Label>
        <Icon sf="magnifyingglass" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger>
        <Label>Saved</Label>
        <Icon sf="bookmark.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger>
        <Label>Profile</Label>
        <Icon sf="person.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
