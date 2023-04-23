/**
 * AlgoWorld Swapper
 * Copyright (C) 2022 AlgoWorld
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { SwapConfiguration } from '@/models/Swap';
import axios from 'axios';
import { toast } from 'react-toastify';

export default async function saveSwapConfigurations(
  configurations: SwapConfiguration[],
) {
  const response = await axios
    .post(`/api/storage/save-configurations`, configurations)
    .catch((error) => {
      console.error(error);
      toast.error(`Error saving swap configuration. Please retry.`);
      return { data: null };
    });
  return response.data;
}
