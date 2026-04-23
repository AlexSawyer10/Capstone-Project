export interface CreateListModel {
  /*Okay, so in this create list model im putting in the provider ID so then I can then in
  the backend match the provider ID is where the user ID. I won't have the user ID passed to the client side and then stored here
  because the user can access it and change the user ID. The provider ID is so complex that it can't be
  replicated to someone elses*/
  provider_id: string;
  list_name: string;
  list_description: string;
  list_image: string | null;
  public: boolean;
  /*don't generate auto likes and dislikes here because the user could manually set that in dev tools */
}
