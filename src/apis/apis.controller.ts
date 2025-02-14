// import {
//   Controller,
//   Post,
//   Get,
//   Delete,
//   Param,
//   Req,
//   UseGuards,
//   Body,
// } from '@nestjs/common';
// import { ApiKeyService } from './apis.service';
// import { AuthGuard } from 'src/guards/auth.guard';
// import { CurrentUser } from 'src/decorators/currentUser.decorator';
// import { Session } from 'src/auth/entities/auth.entity';
// // import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @Controller('api-keys')
// @UseGuards(AuthGuard)
// export class ApiKeyController {
//   constructor(private readonly apiKeyService: ApiKeyService) {}

//   @Post('generate')
//   async generate(@CurrentUser() session: Session) {
//     return this.apiKeyService.generateApiKey(session.uid);
//   }

//   @Get()
//   async list(@Req() req) {
//     return this.apiKeyService.getUserKeys(req.user.id);
//   }

//   @Delete(':id')
//   async revoke(@Req() req, @Param('id') keyId: number) {
//     return this.apiKeyService.deactivateApiKey(req.user.id, keyId);
//   }
// }
