import ProfileLayout from "../profile-layout";

export const AccountSettingsPage = () => {
  return (
    <ProfileLayout>
      <h1 className="text-3xl font-bold">Settings</h1>
      {/* <p className="text-foreground-muted">Welcome back, {user?.name}!</p> */}
      <section className="flex w-full flex-col space-y-6 py-8">
        <div>
          <h3 className="text-xl">Settings coming soon...</h3>
        </div>
      </section>
    </ProfileLayout>
  );
};
