import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ParseService {
  constructor(private http: HttpService) {}

  async workouts(
    user: string,
    options: { after?: string; template?: boolean },
  ) {
    const body = {
      _method: 'GET',
      count: 1,
      limit: '1000',
      order: '-updatedAt',
      include: [
        'parseOriginRoutine',
        'parseOriginRoutine.parseFolder',
        'parseRoutine',
        'parseRoutine.parseFolder',
        'parseSetGroups.parseExercise',
      ].join(','),
      where: {
        updatedAt: options.after
          ? {
              $gt: {
                __type: 'Date',
                iso: options.after,
              },
            }
          : undefined,
        user: {
          __type: 'Pointer',
          className: '_User',
          objectId: user,
        },
        isHidden: 0,
      },
    };

    try {
      const { data } = await this.http
        .post('classes/ParseWorkout', body)
        .toPromise();

      return data;
    } catch (e) {
      console.error(e.message, e.request, e.response.data);
      throw e;
    }
  }

  async measurements(user: string, limit = 10) {
    const body = {
      _method: 'GET',
      count: 1,
      limit: String(limit),
      order: '-createdAt',
      where: {
        user: {
          __type: 'Pointer',
          className: '_User',
          objectId: user,
        },
      },
    };

    try {
      const { data } = await this.http
        .post('classes/ParseMeasurement', body)
        .toPromise();

      return data;
    } catch (e) {
      console.error(e.message, e.request, e.response.data);
      throw e;
    }
  }

  async exercises(user?: string) {
    const body = {
      _method: 'GET',
      order: '-createdAt',
      where: {
        isGlobal: !user,
        isHidden: false,
        user: user
          ? {
              __type: 'Pointer',
              className: '_User',
              objectId: user,
            }
          : undefined,
      },
    };

    try {
      const { data } = await this.http
        .post('classes/ParseExercise', body)
        .toPromise();

      return data;
    } catch (e) {
      console.error(e.message, e.request, e.response.data);
      throw e;
    }
  }

  async user(id: string) {
    const { data } = await this.http.get(`classes/_User/${id}`).toPromise();

    return data;
  }
}
