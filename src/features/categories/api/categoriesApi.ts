import { apiClient } from '@/lib/apiClient';
import type { Session } from '../../auth/session';
import * as guest from '../../transactions/api/guestBookApi';

export type CategoryChange =
  | { action: 'save'; name: string; icon?: string | null; id?: string }
  | { action: 'delete'; id: string };

export async function changeCategory(change: CategoryChange, session: Session | null) {
  if (!session) {
    if (change.action === 'delete') await guest.deleteCategory(change.id);
    else await guest.saveCategory(change.name, change.id, change.icon);
    return;
  }
  if (!session.bookId) throw new Error('Hãy chọn hoặc tạo sổ trước.');
  const path = '/books/' + encodeURIComponent(session.bookId) + '/categories';
  const options = { accessToken: session.accessToken };
  if (change.action === 'delete')
    await apiClient.delete(path + '/' + encodeURIComponent(change.id), options);
  else if (change.id)
    await apiClient.put(
      path + '/' + encodeURIComponent(change.id),
      { name: change.name, icon: change.icon },
      options,
    );
  else await apiClient.post(path, { name: change.name, icon: change.icon }, options);
}
